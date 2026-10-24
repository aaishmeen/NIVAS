package db;

import server.config.EnvConfig;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * PostgreSQL Database Configuration & Connection Provider for NIVAS.
 * Automatically handles database creation, schema synchronization, and connection pooling.
 */
public class DatabaseConfig {
    private static boolean driverLoaded = false;
    private static Boolean connected = null;

    static {
        try {
            Class.forName("org.postgresql.Driver");
            driverLoaded = true;
        } catch (ClassNotFoundException e) {
            System.err.println("[PostgreSQL] Driver org.postgresql.Driver not found on classpath.");
            System.err.println("[PostgreSQL] Ensure lib/postgresql-42.7.4.jar is present in your classpath.");
            driverLoaded = false;
        }
    }

    public static boolean isDriverAvailable() {
        return driverLoaded;
    }

    public static boolean isDbEnabled() {
        return EnvConfig.getBoolean("DB_ENABLED", true);
    }

    public static String getHost() {
        return EnvConfig.get("DB_HOST", "localhost");
    }

    public static int getPort() {
        return EnvConfig.getInt("DB_PORT", 5432);
    }

    public static String getDbName() {
        return EnvConfig.get("DB_NAME", "nivas_db");
    }

    public static String getUser() {
        return EnvConfig.get("DB_USER", "postgres");
    }

    public static String getPassword() {
        return EnvConfig.get("DB_PASSWORD", "");
    }

    public static boolean isAutoInit() {
        return EnvConfig.getBoolean("DB_AUTO_INIT", true);
    }

    public static String getJdbcUrl() {
        return "jdbc:postgresql://" + getHost() + ":" + getPort() + "/" + getDbName();
    }

    public static String getMaintenanceJdbcUrl() {
        return "jdbc:postgresql://" + getHost() + ":" + getPort() + "/postgres";
    }

    /**
     * Obtains a direct connection to the target NIVAS database.
     */
    public static Connection getConnection() throws SQLException {
        if (!driverLoaded) {
            throw new SQLException("PostgreSQL JDBC driver not loaded.");
        }
        return DriverManager.getConnection(getJdbcUrl(), getUser(), getPassword());
    }

    /**
     * Obtains a connection to the PostgreSQL maintenance database ('postgres')
     * used for auto-creating 'nivas_db' if it does not yet exist.
     */
    public static Connection getMaintenanceConnection() throws SQLException {
        if (!driverLoaded) {
            throw new SQLException("PostgreSQL JDBC driver not loaded.");
        }
        return DriverManager.getConnection(getMaintenanceJdbcUrl(), getUser(), getPassword());
    }

    /**
     * Tests and establishes initial database connection. Auto-creates 'nivas_db'
     * and runs schema migrations if configured.
     *
     * @return true if successfully connected and initialized, false otherwise.
     */
    public static synchronized boolean initializeDatabase() {
        if (!isDbEnabled()) {
            System.out.println("[PostgreSQL] DB_ENABLED is set to false. Using in-memory store.");
            connected = false;
            return false;
        }

        if (!driverLoaded) {
            System.out.println("[PostgreSQL] JDBC driver unavailable. Using in-memory store.");
            connected = false;
            return false;
        }

        System.out.println("=================================================");
        System.out.println("   Connecting to PostgreSQL Database...");
        System.out.println("   Target: " + getJdbcUrl() + " (User: " + getUser() + ")");
        System.out.println("=================================================");

        // Step 1: Ensure database 'nivas_db' exists
        try {
            ensureDatabaseExists();
        } catch (SQLException e) {
            System.err.println("[PostgreSQL WARNING] Could not verify/create database '" + getDbName() + "': " + e.getMessage());
        }

        // Step 2: Test connecting directly to target database
        try (Connection conn = getConnection()) {
            System.out.println("[PostgreSQL SUCCESS] Connected to database '" + getDbName() + "'.");
            connected = true;

            // Step 3: Run schema and seed scripts if auto-init is enabled
            if (isAutoInit()) {
                initSchemaAndSeed(conn);
            }
            return true;
        } catch (SQLException e) {
            System.err.println("[PostgreSQL ERROR] Failed to connect to '" + getDbName() + "': " + e.getMessage());
            System.err.println("-------------------------------------------------");
            System.err.println("  TIP: Please verify the PostgreSQL credentials in your .env file:");
            System.err.println("       DB_HOST=" + getHost());
            System.err.println("       DB_PORT=" + getPort());
            System.err.println("       DB_NAME=" + getDbName());
            System.err.println("       DB_USER=" + getUser());
            System.err.println("       DB_PASSWORD=your_password_here");
            System.err.println("-------------------------------------------------");
            System.err.println("[PostgreSQL] Falling back to In-Memory mode so application remains functional.");
            connected = false;
            return false;
        }
    }

    private static void ensureDatabaseExists() throws SQLException {
        try (Connection maintConn = getMaintenanceConnection();
             Statement stmt = maintConn.createStatement()) {

            ResultSet rs = stmt.executeQuery(
                    "SELECT 1 FROM pg_database WHERE datname = '" + getDbName() + "'"
            );
            if (!rs.next()) {
                System.out.println("[PostgreSQL] Database '" + getDbName() + "' does not exist. Creating...");
                stmt.executeUpdate("CREATE DATABASE " + getDbName());
                System.out.println("[PostgreSQL] Database '" + getDbName() + "' created successfully.");
            }
        }
    }

    private static void initSchemaAndSeed(Connection conn) {
        try {
            // Check if users table exists
            try (Statement checkStmt = conn.createStatement();
                 ResultSet rs = checkStmt.executeQuery("SELECT to_regclass('public.users')")) {
                if (rs.next() && rs.getString(1) != null) {
                    System.out.println("[PostgreSQL] Schema already initialized.");
                    return;
                }
            }

            System.out.println("[PostgreSQL] Initializing tables and seed data...");
            executeSqlFile(conn, "database/schema.sql");
            executeSqlFile(conn, "database/seed.sql");
            System.out.println("[PostgreSQL] Database schema & seed data initialized successfully.");
        } catch (Exception e) {
            System.err.println("[PostgreSQL WARNING] Auto-initialization encountered an issue: " + e.getMessage());
        }
    }

    private static void executeSqlFile(Connection conn, String relativePath) {
        File file = new File(relativePath);
        if (!file.exists()) {
            file = new File("../" + relativePath);
        }
        if (!file.exists()) {
            System.err.println("[PostgreSQL] SQL file not found: " + relativePath);
            return;
        }

        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                // Strip full-line comments
                if (line.startsWith("--") || line.isEmpty()) {
                    continue;
                }
                // Strip inline comments: text -- comment
                int commentIdx = line.indexOf("--");
                if (commentIdx >= 0) {
                    line = line.substring(0, commentIdx).trim();
                }
                if (line.isEmpty()) {
                    continue;
                }
                sb.append(line).append(" ");
                if (line.endsWith(";")) {
                    String sql = sb.toString().trim();
                    try (Statement stmt = conn.createStatement()) {
                        stmt.execute(sql);
                    }
                    sb.setLength(0);
                }
            }
        } catch (Exception e) {
            System.err.println("[PostgreSQL] Error executing " + relativePath + ": " + e.getMessage());
        }
    }

    public static boolean isConnected() {
        return connected != null && connected;
    }
}
