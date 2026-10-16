package server.config;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Lightweight, zero-dependency environment configuration loader.
 * Reads key-value pairs from .env file, with fallback to system properties and environment variables.
 */
public class EnvConfig {
    private static final Map<String, String> envMap = new HashMap<>();
    private static boolean initialized = false;

    static {
        load();
    }

    public static synchronized void load() {
        if (initialized) return;

        // Search for .env in current directory or parent directory
        File[] candidateFiles = new File[] {
            new File(".env"),
            new File("../.env"),
            new File("c:/projects/NIVAS/NIVAS/.env")
        };

        for (File file : candidateFiles) {
            if (file.exists() && file.isFile() && file.canRead()) {
                try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        // Skip empty lines and comments
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        if (eqIdx > 0) {
                            String key = line.substring(0, eqIdx).trim();
                            String value = line.substring(eqIdx + 1).trim();
                            // Strip enclosing quotes if present
                            if ((value.startsWith("\"") && value.endsWith("\"")) ||
                                (value.startsWith("'") && value.endsWith("'"))) {
                                value = value.substring(1, value.length() - 1);
                            }
                            envMap.put(key, value);
                        }
                    }
                    System.out.println("Loaded environment configuration from: " + file.getAbsolutePath());
                    break;
                } catch (IOException e) {
                    System.err.println("Warning: Failed to read .env from " + file.getAbsolutePath() + ": " + e.getMessage());
                }
            }
        }
        initialized = true;
    }

    public static String get(String key, String defaultValue) {
        String val = envMap.get(key);
        if (val != null && !val.trim().isEmpty()) {
            return val.trim();
        }
        val = System.getenv(key);
        if (val != null && !val.trim().isEmpty()) {
            return val.trim();
        }
        val = System.getProperty(key);
        if (val != null && !val.trim().isEmpty()) {
            return val.trim();
        }
        return defaultValue;
    }

    public static int getInt(String key, int defaultValue) {
        String val = get(key, null);
        if (val == null) return defaultValue;
        try {
            return Integer.parseInt(val);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    public static boolean getBoolean(String key, boolean defaultValue) {
        String val = get(key, null);
        if (val == null) return defaultValue;
        return Boolean.parseBoolean(val);
    }
}
