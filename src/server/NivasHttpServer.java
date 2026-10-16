package server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import model.*;
import server.config.EnvConfig;
import server.exception.*;
import server.security.RateLimiter;
import server.security.RateLimiter.RateLimitResult;
import service.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

public class NivasHttpServer {
    private static final int PORT = 8080;
    private static final int MAX_BODY_SIZE = 1_048_576; // 1 MB payload protection

    private static DataStore dataStore = DataStore.getInstance();
    private static AuthenticationService authService = new AuthenticationService();
    private static RoomService roomService = new RoomService();
    private static OnboardingService onboardingService = new OnboardingService(roomService);
    private static LaundryService laundryService = new LaundryService();
    private static WiFiService wifiService = new WiFiService();
    private static TicketService ticketService = new TicketService();
    private static AssistanceService assistanceService = new AssistanceService();
    private static AnnouncementService announcementService = new AnnouncementService();

    private static RateLimiter rateLimiter = new RateLimiter();

    public static void main(String[] args) throws IOException {
        int port = EnvConfig.getInt("SERVER_PORT", PORT);
        startServer(port);
    }

    public static HttpServer startServer(int port) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/api", new ApiHandler());
        server.setExecutor(java.util.concurrent.Executors.newCachedThreadPool());
        server.start();
        System.out.println("=================================================");
        System.out.println("   NIVAS HTTP API Server running on port " + port);
        System.out.println("   API Root: http://localhost:" + port + "/api");
        System.out.println("   Rate Limiter: " + (rateLimiter.isEnabled() ? "ACTIVE (" + rateLimiter.getGlobalLimit() + " req/min global, " + rateLimiter.getAuthLimit() + " req/min auth)" : "DISABLED"));
        System.out.println("=================================================");
        return server;
    }

    static class ApiHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Enable CORS
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                exchange.close();
                return;
            }

            String path = exchange.getRequestURI().getPath();
            String query = exchange.getRequestURI().getQuery();
            Map<String, String> queryParams = parseQueryParams(query);
            String method = exchange.getRequestMethod();
            String clientIp = getClientIp(exchange);

            String responseJson = "{}";
            int statusCode = 200;

            try {
                // Rate Limiter Enforcement
                boolean isAuthEndpoint = path.equals("/api/auth/login") || path.equals("/api/auth/verify-otp");
                RateLimitResult rl = rateLimiter.checkRateLimit(clientIp, isAuthEndpoint);
                exchange.getResponseHeaders().set("X-RateLimit-Limit", String.valueOf(rl.limit));
                exchange.getResponseHeaders().set("X-RateLimit-Remaining", String.valueOf(rl.remaining));
                exchange.getResponseHeaders().set("X-RateLimit-Reset", String.valueOf(rl.resetSeconds));

                String requestBody = readBody(exchange.getRequestBody());
                Map<String, String> bodyMap = parseSimpleJson(requestBody);

                if (path.equals("/api/auth/login") && method.equals("POST")) {
                    String username = bodyMap.getOrDefault("username", "");
                    String password = bodyMap.getOrDefault("password", "");
                    User user = authService.authenticateUser(username, password);

                    if (user != null) {
                        responseJson = "{\"success\":true,\"requiresOtp\":false,\"user\":" + serializeUser(user) + "}";
                    } else {
                        statusCode = 401;
                        responseJson = "{\"success\":false,\"message\":\"Invalid credentials. Please verify your ID and password.\"}";
                    }
                } else if (path.equals("/api/auth/verify-otp") && method.equals("POST")) {
                    String enteredOtp = bodyMap.getOrDefault("otp", "");
                    String studentId = bodyMap.getOrDefault("studentId", "");
                    boolean valid = authService.verifyOtp(enteredOtp);
                    if (valid) {
                        Student s = dataStore.findStudentById(studentId);
                        if (s != null) {
                            s.setFirstLogin(false);
                        }
                        responseJson = "{\"success\":true,\"message\":\"OTP verified successfully.\"}";
                    } else {
                        statusCode = 400;
                        responseJson = "{\"success\":false,\"message\":\"Invalid or expired OTP. Please check the console dispatch.\"}";
                    }
                } else if (path.equals("/api/auth/user") && method.equals("GET")) {
                    String userId = queryParams.getOrDefault("userId", "");
                    User u = findUserByIdOrEmail(userId);
                    if (u != null) {
                        responseJson = "{\"success\":true,\"user\":" + serializeUser(u) + "}";
                    } else {
                        statusCode = 404;
                        responseJson = "{\"success\":false,\"message\":\"User not found.\"}";
                    }
                } else if (path.equals("/api/announcements") && method.equals("GET")) {
                    String role = queryParams.getOrDefault("role", queryParams.getOrDefault("division", "")).trim().toUpperCase();
                    ArrayList<Announcement> all = dataStore.getAnnouncements();
                    ArrayList<Announcement> filtered = new ArrayList<>();
                    for (Announcement a : all) {
                        String target = a.getTargetAudience();
                        if (role.isEmpty() || role.equals("ADMIN") || target.equals("ALL") || target.equalsIgnoreCase(role)) {
                            filtered.add(a);
                        }
                    }
                    responseJson = "{\"success\":true,\"announcements\":" + serializeAnnouncements(filtered) + "}";
                } else if (path.equals("/api/announcements/create") && method.equals("POST")) {
                    String title = bodyMap.getOrDefault("title", "");
                    String message = bodyMap.getOrDefault("message", "");
                    String author = bodyMap.getOrDefault("author", "Chief Warden Office");
                    String targetAudience = bodyMap.getOrDefault("targetAudience", bodyMap.getOrDefault("division", "ALL"));
                    announcementService.publishAnnouncement(title, message, author, targetAudience);
                    responseJson = "{\"success\":true,\"message\":\"Announcement published.\",\"announcements\":" +
                            serializeAnnouncements(dataStore.getAnnouncements()) + "}";
                } else if (path.equals("/api/rooms") && method.equals("GET")) {
                    responseJson = "{\"success\":true,\"rooms\":" + serializeRooms(dataStore.getRooms()) + "}";
                } else if (path.equals("/api/mess-plans") && method.equals("GET")) {
                    responseJson = "{\"success\":true,\"messPlans\":" + serializeMessPlans(dataStore.getMessPlans()) + "}";
                } else if (path.equals("/api/student/dashboard") && method.equals("GET")) {
                    String studentId = queryParams.getOrDefault("studentId", "MUJ12345");
                    Student s = dataStore.findStudentById(studentId);
                    if (s != null) {
                        ArrayList<Announcement> studentAnn = new ArrayList<>();
                        for (Announcement a : dataStore.getAnnouncements()) {
                            if (a.getTargetAudience().equalsIgnoreCase("STUDENT") || a.getTargetAudience().equalsIgnoreCase("ALL")) {
                                studentAnn.add(a);
                            }
                        }
                        responseJson = "{\"success\":true," +
                                "\"student\":" + serializeStudent(s) + "," +
                                "\"announcements\":" + serializeAnnouncements(studentAnn) + "," +
                                "\"tickets\":" + serializeTickets(ticketService.getTicketsByStudent(s.getStudentId())) + "," +
                                "\"assistanceRequests\":" + serializeAssistance(assistanceService.getRequestsByStudent(s.getStudentId())) + "," +
                                "\"laundryRequests\":" + serializeLaundry(laundryService.getRequestsByStudent(s.getStudentId())) +
                                "}";
                    } else {
                        statusCode = 404;
                        responseJson = "{\"success\":false,\"message\":\"Student not found.\"}";
                    }
                } else if (path.equals("/api/student/onboarding/personal-details") && method.equals("POST")) {
                    String studentId = bodyMap.getOrDefault("studentId", "");
                    Student s = dataStore.findStudentById(studentId);
                    if (s != null) {
                        onboardingService.submitPersonalDetails(s,
                                bodyMap.getOrDefault("fullName", s.getName()),
                                bodyMap.getOrDefault("phone", ""),
                                bodyMap.getOrDefault("gender", "Other"),
                                bodyMap.getOrDefault("branch", "Computer Science"),
                                Integer.parseInt(bodyMap.getOrDefault("year", "2")),
                                bodyMap.getOrDefault("address", ""),
                                bodyMap.getOrDefault("guardianName", ""),
                                bodyMap.getOrDefault("guardianPhone", ""));
                        responseJson = "{\"success\":true,\"message\":\"Personal details updated successfully.\",\"student\":" + serializeStudent(s) + "}";
                    } else {
                        statusCode = 404;
                        responseJson = "{\"success\":false,\"message\":\"Student not found.\"}";
                    }
                } else if (path.equals("/api/student/onboarding/aadhaar") && method.equals("POST")) {
                    String studentId = bodyMap.getOrDefault("studentId", "");
                    Student s = dataStore.findStudentById(studentId);
                    if (s != null) {
                        onboardingService.submitAadhaar(s, bodyMap.getOrDefault("aadhaarNumber", "1234-5678-9012"));
                        responseJson = "{\"success\":true,\"message\":\"Aadhaar uploaded successfully.\",\"student\":" + serializeStudent(s) + "}";
                    } else {
                        statusCode = 404;
                        responseJson = "{\"success\":false,\"message\":\"Student not found.\"}";
                    }
                } else if (path.equals("/api/student/onboarding/undertaking") && method.equals("POST")) {
                    String studentId = bodyMap.getOrDefault("studentId", "");
                    Student s = dataStore.findStudentById(studentId);
                    if (s != null) {
                        onboardingService.acceptUndertaking(s);
                        responseJson = "{\"success\":true,\"message\":\"Undertaking accepted successfully.\",\"student\":" + serializeStudent(s) + "}";
                    } else {
                        statusCode = 404;
                        responseJson = "{\"success\":false,\"message\":\"Student not found.\"}";
                    }
                } else if (path.equals("/api/student/onboarding/pay-fee") && method.equals("POST")) {
                    String studentId = bodyMap.getOrDefault("studentId", "");
                    Student s = dataStore.findStudentById(studentId);
                    if (s != null) {
                        onboardingService.payHostelFee(s);
                        responseJson = "{\"success\":true,\"message\":\"Payment processed successfully via Razorpay test.\",\"student\":" + serializeStudent(s) + "}";
                    } else {
                        statusCode = 404;
                        responseJson = "{\"success\":false,\"message\":\"Student not found.\"}";
                    }
                } else if (path.equals("/api/student/onboarding/select-room") && method.equals("POST")) {
                    String studentId = bodyMap.getOrDefault("studentId", "");
                    String roomNumber = bodyMap.getOrDefault("roomNumber", "");
                    String bedCode = bodyMap.getOrDefault("bedCode", "");
                    Student s = dataStore.findStudentById(studentId);
                    if (s != null) {
                        boolean ok = roomService.allocateBed(s, roomNumber, bedCode);
                        if (ok) {
                            responseJson = "{\"success\":true,\"message\":\"Bed allocated successfully.\",\"student\":" + serializeStudent(s) + "}";
                        } else {
                            statusCode = 400;
                            responseJson = "{\"success\":false,\"message\":\"Bed allocation failed. Room or bed may be full or occupied.\"}";
                        }
                    } else {
                        statusCode = 404;
                        responseJson = "{\"success\":false,\"message\":\"Student not found.\"}";
                    }
                } else if (path.equals("/api/student/onboarding/select-mess") && method.equals("POST")) {
                    String studentId = bodyMap.getOrDefault("studentId", "");
                    String planId = bodyMap.getOrDefault("planId", "MP01");
                    Student s = dataStore.findStudentById(studentId);
                    if (s != null) {
                        boolean ok = onboardingService.selectMessPlan(s, planId);
                        if (ok) {
                            responseJson = "{\"success\":true,\"message\":\"Mess plan selected.\",\"student\":" + serializeStudent(s) + "}";
                        } else {
                            statusCode = 400;
                            responseJson = "{\"success\":false,\"message\":\"Invalid mess plan.\"}";
                        }
                    } else {
                        statusCode = 404;
                        responseJson = "{\"success\":false,\"message\":\"Student not found.\"}";
                    }
                } else if (path.equals("/api/student/onboarding/generate-pass") && method.equals("POST")) {
                    String studentId = bodyMap.getOrDefault("studentId", "");
                    Student s = dataStore.findStudentById(studentId);
                    if (s != null) {
                        HostelPass pass = onboardingService.generateHostelPass(s);
                        if (pass != null) {
                            responseJson = "{\"success\":true,\"message\":\"Digital Hostel Pass generated!\",\"pass\":" + serializePass(pass) + ",\"student\":" + serializeStudent(s) + "}";
                        } else {
                            statusCode = 400;
                            responseJson = "{\"success\":false,\"message\":\"Cannot generate pass. Please complete all prior onboarding steps first.\"}";
                        }
                    } else {
                        statusCode = 404;
                        responseJson = "{\"success\":false,\"message\":\"Student not found.\"}";
                    }
                } else if (path.equals("/api/laundry/requests") && method.equals("GET")) {
                    String studentId = queryParams.get("studentId");
                    ArrayList<LaundryRequest> list = (studentId != null && !studentId.isEmpty())
                            ? laundryService.getRequestsByStudent(studentId)
                            : laundryService.getAllRequests();
                    responseJson = "{\"success\":true,\"requests\":" + serializeLaundry(list) + "}";
                } else if (path.equals("/api/laundry/create") && method.equals("POST")) {
                    String studentId = bodyMap.getOrDefault("studentId", "");
                    int count = Integer.parseInt(bodyMap.getOrDefault("numberOfClothes", "5"));
                    Student s = dataStore.findStudentById(studentId);
                    if (s != null) {
                        LaundryRequest req = laundryService.createPickupRequest(s, count);
                        if (req != null) {
                            responseJson = "{\"success\":true,\"message\":\"Laundry pickup request created.\",\"request\":" + serializeLaundryRequest(req) +
                                    ",\"remainingCycles\":" + s.getLaundryPlan().getRemainingCycles() + "}";
                        } else {
                            statusCode = 400;
                            responseJson = "{\"success\":false,\"message\":\"No laundry cycles remaining.\"}";
                        }
                    } else {
                        statusCode = 404;
                        responseJson = "{\"success\":false,\"message\":\"Student not found.\"}";
                    }
                } else if (path.equals("/api/laundry/update-status") && method.equals("POST")) {
                    String requestId = bodyMap.getOrDefault("requestId", "");
                    String newStatus = bodyMap.getOrDefault("newStatus", "DELIVERED");
                    boolean ok = laundryService.updateStatus(requestId, newStatus);
                    if (ok) {
                        responseJson = "{\"success\":true,\"message\":\"Laundry status updated to " + newStatus + ".\"}";
                    } else {
                        statusCode = 400;
                        responseJson = "{\"success\":false,\"message\":\"Request not found.\"}";
                    }
                } else if (path.equals("/api/wifi/simulate") && method.equals("POST")) {
                    String studentId = bodyMap.getOrDefault("studentId", "");
                    double gb = Double.parseDouble(bodyMap.getOrDefault("additionalGB", "5.0"));
                    Student s = dataStore.findStudentById(studentId);
                    if (s != null) {
                        wifiService.simulateDataUsage(s, gb);
                        responseJson = "{\"success\":true,\"message\":\"Wi-Fi data usage recorded.\",\"wifiAccount\":" +
                                serializeWifi(s.getWifiAccount()) + "}";
                    } else {
                        statusCode = 404;
                        responseJson = "{\"success\":false,\"message\":\"Student not found.\"}";
                    }
                } else if (path.equals("/api/tickets") && method.equals("GET")) {
                    String studentId = queryParams.get("studentId");
                    String staffId = queryParams.get("staffId");
                    ArrayList<Ticket> list;
                    if (studentId != null && !studentId.isEmpty()) {
                        list = ticketService.getTicketsByStudent(studentId);
                    } else if (staffId != null && !staffId.isEmpty()) {
                        list = ticketService.getTicketsByStaff(staffId);
                    } else {
                        list = ticketService.getAllTickets();
                    }
                    responseJson = "{\"success\":true,\"tickets\":" + serializeTickets(list) + "}";
                } else if (path.equals("/api/tickets/create") && method.equals("POST")) {
                    String studentId = bodyMap.getOrDefault("studentId", "");
                    String category = bodyMap.getOrDefault("category", "General");
                    String description = bodyMap.getOrDefault("description", "");
                    Ticket t = ticketService.createTicket(studentId, category, description);
                    responseJson = "{\"success\":true,\"message\":\"Ticket submitted.\",\"ticket\":" + serializeTicket(t) + "}";
                } else if (path.equals("/api/tickets/assign") && method.equals("POST")) {
                    String ticketId = bodyMap.getOrDefault("ticketId", "");
                    String staffId = bodyMap.getOrDefault("staffId", "");
                    boolean ok = ticketService.assignTicket(ticketId, staffId);
                    if (ok) {
                        responseJson = "{\"success\":true,\"message\":\"Ticket assigned to staff.\"}";
                    } else {
                        statusCode = 400;
                        responseJson = "{\"success\":false,\"message\":\"Ticket assignment failed.\"}";
                    }
                } else if (path.equals("/api/tickets/update-status") && method.equals("POST")) {
                    String ticketId = bodyMap.getOrDefault("ticketId", "");
                    String newStatus = bodyMap.getOrDefault("newStatus", "RESOLVED");
                    String notes = bodyMap.getOrDefault("notes", "");
                    boolean ok = ticketService.updateStatus(ticketId, newStatus, notes);
                    if (ok) {
                        responseJson = "{\"success\":true,\"message\":\"Ticket status updated to " + newStatus + ".\"}";
                    } else {
                        statusCode = 400;
                        responseJson = "{\"success\":false,\"message\":\"Ticket update failed.\"}";
                    }
                } else if (path.equals("/api/assistance") && method.equals("GET")) {
                    String studentId = queryParams.get("studentId");
                    String staffId = queryParams.get("staffId");
                    ArrayList<AssistanceRequest> list;
                    if (studentId != null && !studentId.isEmpty()) {
                        list = assistanceService.getRequestsByStudent(studentId);
                    } else if (staffId != null && !staffId.isEmpty()) {
                        list = new ArrayList<>();
                        for (AssistanceRequest ar : assistanceService.getAllRequests()) {
                            if (staffId.equalsIgnoreCase(ar.getAssignedStaffId())) {
                                list.add(ar);
                            }
                        }
                    } else {
                        list = assistanceService.getAllRequests();
                    }
                    responseJson = "{\"success\":true,\"requests\":" + serializeAssistance(list) + "}";
                } else if (path.equals("/api/assistance/create") && method.equals("POST")) {
                    String studentId = bodyMap.getOrDefault("studentId", "");
                    String type = bodyMap.getOrDefault("assistanceType", "MEDICAL_HELP");
                    String desc = bodyMap.getOrDefault("description", "");
                    AssistanceRequest req = assistanceService.createRequest(studentId, type, desc);
                    responseJson = "{\"success\":true,\"message\":\"Emergency assistance request submitted.\",\"request\":" +
                            serializeAssistanceRequest(req) + "}";
                } else if (path.equals("/api/assistance/update-status") && method.equals("POST")) {
                    String reqId = bodyMap.getOrDefault("requestId", "");
                    String newStatus = bodyMap.getOrDefault("newStatus", "IN_PROGRESS");
                    String staffId = bodyMap.getOrDefault("staffId", "STF01");
                    boolean ok = assistanceService.updateStatus(reqId, newStatus, staffId);
                    if (ok) {
                        responseJson = "{\"success\":true,\"message\":\"Assistance request status updated.\"}";
                    } else {
                        statusCode = 400;
                        responseJson = "{\"success\":false,\"message\":\"Request update failed.\"}";
                    }
                } else if (path.equals("/api/admin/overview") && method.equals("GET")) {
                    ArrayList<Student> students = new ArrayList<>();
                    int totalRooms = dataStore.getRooms().size();
                    int totalBeds = 0;
                    int occupiedBeds = 0;
                    for (Room r : dataStore.getRooms()) {
                        totalBeds += r.getCapacity();
                        occupiedBeds += r.getOccupiedCount();
                    }
                    for (User u : dataStore.getUsers()) {
                        if (u instanceof Student) {
                            students.add((Student) u);
                        }
                    }
                    responseJson = "{\"success\":true," +
                            "\"totalStudents\":" + students.size() + "," +
                            "\"totalRooms\":" + totalRooms + "," +
                            "\"totalBeds\":" + totalBeds + "," +
                            "\"occupiedBeds\":" + occupiedBeds + "," +
                            "\"availableBeds\":" + (totalBeds - occupiedBeds) + "," +
                            "\"openTickets\":" + dataStore.getTickets().size() + "," +
                            "\"openAssistance\":" + dataStore.getAssistanceRequests().size() + "," +
                            "\"students\":" + serializeStudentsList(students) + "," +
                            "\"rooms\":" + serializeRooms(dataStore.getRooms()) + "," +
                            "\"tickets\":" + serializeTickets(dataStore.getTickets()) + "," +
                            "\"assistanceRequests\":" + serializeAssistance(dataStore.getAssistanceRequests()) +
                            "}";
                } else if (path.equals("/api/admin/verify-student") && method.equals("POST")) {
                    String studentId = bodyMap.getOrDefault("studentId", "");
                    Student s = dataStore.findStudentById(studentId);
                    if (s != null) {
                        onboardingService.adminVerifyStudent(s);
                        responseJson = "{\"success\":true,\"message\":\"Student " + escape(s.getName()) + " verified by Administrator.\"}";
                    } else {
                        statusCode = 404;
                        responseJson = "{\"success\":false,\"message\":\"Student not found.\"}";
                    }
                } else if (path.equals("/api/staff/overview") && method.equals("GET")) {
                    String staffId = queryParams.getOrDefault("staffId", "STF01");
                    Staff staff = dataStore.findStaffById(staffId);
                    ArrayList<Ticket> blockTickets = new ArrayList<>();
                    ArrayList<AssistanceRequest> staffAssistance = new ArrayList<>();
                    ArrayList<Room> blockRooms = new ArrayList<>();

                    String block = staff != null ? staff.getAssignedBlock() : "Block A";
                    for (Room r : dataStore.getRooms()) {
                        if (r.getBlock().equalsIgnoreCase(block)) {
                            blockRooms.add(r);
                        }
                    }
                    for (Ticket t : dataStore.getTickets()) {
                        if (staffId.equalsIgnoreCase(t.getAssignedToStaffId()) || "SUBMITTED".equalsIgnoreCase(t.getStatus())) {
                            blockTickets.add(t);
                        }
                    }
                    for (AssistanceRequest a : dataStore.getAssistanceRequests()) {
                        staffAssistance.add(a);
                    }

                    responseJson = "{\"success\":true," +
                            "\"staff\":" + (staff != null ? serializeUser(staff) : "null") + "," +
                            "\"assignedBlock\":\"" + escape(block) + "\"," +
                            "\"rooms\":" + serializeRooms(blockRooms) + "," +
                            "\"tickets\":" + serializeTickets(blockTickets) + "," +
                            "\"assistanceRequests\":" + serializeAssistance(staffAssistance) + "," +
                            "\"laundryRequests\":" + serializeLaundry(dataStore.getLaundryRequests()) +
                            "}";
                } else {
                    throw new ResourceNotFoundException("Endpoint not found: " + path);
                }
            } catch (RateLimitException ex) {
                statusCode = ex.getStatusCode();
                exchange.getResponseHeaders().set("Retry-After", String.valueOf(ex.getRetryAfterSeconds()));
                responseJson = buildErrorJson(statusCode, ex.getErrorCode(), ex.getMessage(), path);
                System.err.println("⚠️ [429] Rate limit exceeded for IP: " + ex.getClientIp() + " on " + path);
            } catch (ApiException ex) {
                statusCode = ex.getStatusCode();
                responseJson = buildErrorJson(statusCode, ex.getErrorCode(), ex.getMessage(), path);
                System.err.println("⚠️ [" + statusCode + "] " + ex.getErrorCode() + " on " + path + ": " + ex.getMessage());
            } catch (IllegalArgumentException ex) {
                statusCode = 400;
                responseJson = buildErrorJson(400, "BAD_REQUEST", "Invalid input or parameter: " + ex.getMessage(), path);
                System.err.println("⚠️ [400] Bad Request on " + path + ": " + ex.getMessage());
            } catch (Exception ex) {
                statusCode = 500;
                responseJson = buildErrorJson(500, "INTERNAL_SERVER_ERROR", "Internal server error: " + (ex.getMessage() != null ? ex.getMessage() : ex.toString()), path);
                ex.printStackTrace();
            }

            byte[] responseBytes = responseJson.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
            exchange.sendResponseHeaders(statusCode, responseBytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(responseBytes);
            }
        }
    }

    private static User findUserByIdOrEmail(String idOrEmail) {
        for (User u : dataStore.getUsers()) {
            if (u.getId().equalsIgnoreCase(idOrEmail) || u.getEmail().equalsIgnoreCase(idOrEmail)) {
                return u;
            }
            if (u instanceof Student && ((Student) u).getStudentId().equalsIgnoreCase(idOrEmail)) {
                return u;
            }
        }
        return null;
    }

    private static String serializeUser(User user) {
        StringBuilder sb = new StringBuilder("{");
        sb.append("\"id\":\"").append(escape(user.getId())).append("\",");
        sb.append("\"name\":\"").append(escape(user.getName())).append("\",");
        sb.append("\"email\":\"").append(escape(user.getEmail())).append("\",");
        sb.append("\"role\":\"").append(escape(user.getRole())).append("\",");
        sb.append("\"isFirstLogin\":").append(user.isFirstLogin());

        if (user instanceof Student) {
            Student s = (Student) user;
            sb.append(",\"studentId\":\"").append(escape(s.getStudentId())).append("\"");
            sb.append(",\"allocatedRoom\":").append(s.getAllocatedRoom() != null ? "\"" + escape(s.getAllocatedRoom()) + "\"" : "null");
            sb.append(",\"allocatedBed\":").append(s.getAllocatedBed() != null ? "\"" + escape(s.getAllocatedBed()) + "\"" : "null");
        } else if (user instanceof Admin) {
            Admin a = (Admin) user;
            sb.append(",\"department\":\"").append(escape(a.getDepartment())).append("\"");
        } else if (user instanceof Staff) {
            Staff st = (Staff) user;
            sb.append(",\"designation\":\"").append(escape(st.getDesignation())).append("\"");
            sb.append(",\"assignedBlock\":\"").append(escape(st.getAssignedBlock())).append("\"");
        }
        sb.append("}");
        return sb.toString();
    }

    private static String serializeStudent(Student s) {
        StringBuilder sb = new StringBuilder("{");
        sb.append("\"id\":\"").append(escape(s.getId())).append("\",");
        sb.append("\"studentId\":\"").append(escape(s.getStudentId())).append("\",");
        sb.append("\"name\":\"").append(escape(s.getName())).append("\",");
        sb.append("\"email\":\"").append(escape(s.getEmail())).append("\",");
        sb.append("\"role\":\"STUDENT\",");
        sb.append("\"allocatedRoom\":").append(s.getAllocatedRoom() != null ? "\"" + escape(s.getAllocatedRoom()) + "\"" : "null").append(",");
        sb.append("\"allocatedBed\":").append(s.getAllocatedBed() != null ? "\"" + escape(s.getAllocatedBed()) + "\"" : "null").append(",");

        // Personal Details
        PersonalDetails pd = s.getPersonalDetails();
        sb.append("\"personalDetails\":{");
        sb.append("\"fullName\":\"").append(escape(pd.getFullName() != null ? pd.getFullName() : s.getName())).append("\",");
        sb.append("\"phone\":\"").append(escape(pd.getPhone())).append("\",");
        sb.append("\"gender\":\"").append(escape(pd.getGender())).append("\",");
        sb.append("\"branch\":\"").append(escape(pd.getBranch())).append("\",");
        sb.append("\"year\":").append(pd.getYear()).append(",");
        sb.append("\"address\":\"").append(escape(pd.getAddress())).append("\",");
        sb.append("\"guardianName\":\"").append(escape(pd.getGuardianName())).append("\",");
        sb.append("\"guardianPhone\":\"").append(escape(pd.getGuardianPhone())).append("\"");
        sb.append("},");

        // Document
        Document doc = s.getDocument();
        sb.append("\"document\":{");
        sb.append("\"documentType\":\"").append(escape(doc.getDocumentType())).append("\",");
        sb.append("\"documentNumber\":\"").append(escape(doc.getDocumentNumber())).append("\",");
        sb.append("\"submitted\":").append(doc.isSubmitted()).append(",");
        sb.append("\"undertakingAccepted\":").append(doc.isUndertakingAccepted());
        sb.append("},");

        // Payment
        Payment p = s.getPayment();
        sb.append("\"payment\":{");
        sb.append("\"paymentId\":\"").append(escape(p.getPaymentId())).append("\",");
        sb.append("\"amount\":").append(p.getAmount()).append(",");
        sb.append("\"status\":\"").append(escape(p.getStatus())).append("\",");
        sb.append("\"transactionRef\":\"").append(escape(p.getTransactionRef())).append("\",");
        sb.append("\"paymentDate\":\"").append(escape(p.getPaymentDate())).append("\"");
        sb.append("},");

        // Onboarding Application
        OnboardingApplication app = s.getOnboardingApp();
        sb.append("\"onboardingApp\":{");
        sb.append("\"personalDetailsCompleted\":").append(app.isPersonalDetailsCompleted()).append(",");
        sb.append("\"documentsSubmitted\":").append(app.isDocumentsSubmitted()).append(",");
        sb.append("\"undertakingAccepted\":").append(app.isUndertakingAccepted()).append(",");
        sb.append("\"feePaid\":").append(app.isFeePaid()).append(",");
        sb.append("\"adminVerified\":").append(app.isAdminVerified()).append(",");
        sb.append("\"roomBedSelected\":").append(app.isRoomBedSelected()).append(",");
        sb.append("\"messSelected\":").append(app.isMessSelected()).append(",");
        sb.append("\"laundryPlanActivated\":").append(app.isLaundryPlanActivated()).append(",");
        sb.append("\"hostelPassGenerated\":").append(app.isHostelPassGenerated()).append(",");
        sb.append("\"isCompleted\":").append(app.isCompleted()).append(",");
        sb.append("\"nextStep\":\"").append(escape(app.getNextStep())).append("\"");
        sb.append("},");

        // Mess Plan
        MessPlan mp = s.getMessPlan();
        if (mp != null) {
            sb.append("\"messPlan\":{");
            sb.append("\"planId\":\"").append(escape(mp.getPlanId())).append("\",");
            sb.append("\"planName\":\"").append(escape(mp.getPlanName())).append("\",");
            sb.append("\"description\":\"").append(escape(mp.getDescription())).append("\",");
            sb.append("\"monthlyFee\":").append(mp.getMonthlyFee());
            sb.append("},");
        } else {
            sb.append("\"messPlan\":null,");
        }

        // Laundry Plan
        LaundryPlan lp = s.getLaundryPlan();
        sb.append("\"laundryPlan\":{");
        sb.append("\"totalCycles\":").append(lp.getTotalCycles()).append(",");
        sb.append("\"usedCycles\":").append(lp.getUsedCycles()).append(",");
        sb.append("\"remainingCycles\":").append(lp.getRemainingCycles()).append(",");
        sb.append("\"status\":\"").append(escape(lp.getStatus())).append("\"");
        sb.append("},");

        // Wi-Fi Account
        sb.append("\"wifiAccount\":").append(serializeWifi(s.getWifiAccount())).append(",");

        // Hostel Pass
        if (s.getHostelPass() != null) {
            sb.append("\"hostelPass\":").append(serializePass(s.getHostelPass()));
        } else {
            sb.append("\"hostelPass\":null");
        }

        sb.append("}");
        return sb.toString();
    }

    private static String serializeWifi(WiFiAccount wifi) {
        if (wifi == null) return "null";
        return "{" +
                "\"username\":\"" + escape(wifi.getUsername()) + "\"," +
                "\"allocatedGB\":" + wifi.getAllocatedGB() + "," +
                "\"usedGB\":" + String.format(Locale.US, "%.2f", wifi.getUsedGB()) + "," +
                "\"remainingGB\":" + String.format(Locale.US, "%.2f", wifi.getRemainingGB()) + "," +
                "\"status\":\"" + escape(wifi.getStatus()) + "\"" +
                "}";
    }

    private static String serializePass(HostelPass pass) {
        if (pass == null) return "null";
        return "{" +
                "\"passId\":\"" + escape(pass.getPassId()) + "\"," +
                "\"studentId\":\"" + escape(pass.getStudentId()) + "\"," +
                "\"studentName\":\"" + escape(pass.getStudentName()) + "\"," +
                "\"roomNumber\":\"" + escape(pass.getRoomNumber()) + "\"," +
                "\"bedCode\":\"" + escape(pass.getBedCode()) + "\"," +
                "\"messPlanName\":\"" + escape(pass.getMessPlanName()) + "\"," +
                "\"issueDate\":\"" + escape(pass.getIssueDate()) + "\"," +
                "\"status\":\"" + escape(pass.getStatus()) + "\"," +
                "\"verificationCode\":" + pass.getPassId().hashCode() +
                "}";
    }

    private static String serializeRooms(ArrayList<Room> rooms) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < rooms.size(); i++) {
            Room r = rooms.get(i);
            if (i > 0) sb.append(",");
            sb.append("{");
            sb.append("\"roomNumber\":\"").append(escape(r.getRoomNumber())).append("\",");
            sb.append("\"floor\":").append(r.getFloor()).append(",");
            sb.append("\"block\":\"").append(escape(r.getBlock())).append("\",");
            sb.append("\"capacity\":").append(r.getCapacity()).append(",");
            sb.append("\"occupiedCount\":").append(r.getOccupiedCount()).append(",");
            sb.append("\"availableCount\":").append(r.getAvailableCount()).append(",");
            sb.append("\"isFull\":").append(r.isFull()).append(",");
            sb.append("\"beds\":[");
            ArrayList<Bed> beds = r.getBeds();
            for (int j = 0; j < beds.size(); j++) {
                Bed b = beds.get(j);
                if (j > 0) sb.append(",");
                sb.append("{");
                sb.append("\"bedCode\":\"").append(escape(b.getBedCode())).append("\",");
                sb.append("\"occupied\":").append(b.isOccupied()).append(",");
                sb.append("\"allocatedStudentId\":").append(b.getAllocatedStudentId() != null ? "\"" + escape(b.getAllocatedStudentId()) + "\"" : "null");
                sb.append("}");
            }
            sb.append("]}");
        }
        sb.append("]");
        return sb.toString();
    }

    private static String serializeMessPlans(ArrayList<MessPlan> plans) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < plans.size(); i++) {
            MessPlan mp = plans.get(i);
            if (i > 0) sb.append(",");
            sb.append("{");
            sb.append("\"planId\":\"").append(escape(mp.getPlanId())).append("\",");
            sb.append("\"planName\":\"").append(escape(mp.getPlanName())).append("\",");
            sb.append("\"description\":\"").append(escape(mp.getDescription())).append("\",");
            sb.append("\"monthlyFee\":").append(mp.getMonthlyFee());
            sb.append("}");
        }
        sb.append("]");
        return sb.toString();
    }

    private static String serializeAnnouncements(ArrayList<Announcement> list) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            Announcement a = list.get(i);
            if (i > 0) sb.append(",");
            sb.append("{");
            sb.append("\"id\":\"").append(escape(a.getId())).append("\",");
            sb.append("\"title\":\"").append(escape(a.getTitle())).append("\",");
            sb.append("\"message\":\"").append(escape(a.getMessage())).append("\",");
            sb.append("\"date\":\"").append(escape(a.getDate())).append("\",");
            sb.append("\"author\":\"").append(escape(a.getAuthor())).append("\",");
            sb.append("\"targetAudience\":\"").append(escape(a.getTargetAudience())).append("\"");
            sb.append("}");
        }
        sb.append("]");
        return sb.toString();
    }

    private static String serializeTickets(ArrayList<Ticket> list) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            Ticket t = list.get(i);
            if (i > 0) sb.append(",");
            sb.append(serializeTicket(t));
        }
        sb.append("]");
        return sb.toString();
    }

    private static String serializeTicket(Ticket t) {
        return "{" +
                "\"ticketId\":\"" + escape(t.getTicketId()) + "\"," +
                "\"studentId\":\"" + escape(t.getStudentId()) + "\"," +
                "\"category\":\"" + escape(t.getCategory()) + "\"," +
                "\"description\":\"" + escape(t.getDescription()) + "\"," +
                "\"createdDate\":\"" + escape(t.getCreatedDate()) + "\"," +
                "\"status\":\"" + escape(t.getStatus()) + "\"," +
                "\"assignedToStaffId\":\"" + escape(t.getAssignedToStaffId()) + "\"," +
                "\"resolutionNotes\":\"" + escape(t.getResolutionNotes()) + "\"" +
                "}";
    }

    private static String serializeAssistance(ArrayList<AssistanceRequest> list) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            AssistanceRequest a = list.get(i);
            if (i > 0) sb.append(",");
            sb.append(serializeAssistanceRequest(a));
        }
        sb.append("]");
        return sb.toString();
    }

    private static String serializeAssistanceRequest(AssistanceRequest a) {
        return "{" +
                "\"requestId\":\"" + escape(a.getRequestId()) + "\"," +
                "\"studentId\":\"" + escape(a.getStudentId()) + "\"," +
                "\"assistanceType\":\"" + escape(a.getAssistanceType()) + "\"," +
                "\"description\":\"" + escape(a.getDescription()) + "\"," +
                "\"status\":\"" + escape(a.getStatus()) + "\"," +
                "\"assignedStaffId\":\"" + escape(a.getAssignedStaffId()) + "\"," +
                "\"timestamp\":\"" + escape(a.getTimestamp()) + "\"" +
                "}";
    }

    private static String serializeLaundry(ArrayList<LaundryRequest> list) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            LaundryRequest lr = list.get(i);
            if (i > 0) sb.append(",");
            sb.append(serializeLaundryRequest(lr));
        }
        sb.append("]");
        return sb.toString();
    }

    private static String serializeLaundryRequest(LaundryRequest lr) {
        return "{" +
                "\"requestId\":\"" + escape(lr.getRequestId()) + "\"," +
                "\"studentId\":\"" + escape(lr.getStudentId()) + "\"," +
                "\"numberOfClothes\":" + lr.getNumberOfClothes() + "," +
                "\"requestDate\":\"" + escape(lr.getRequestDate()) + "\"," +
                "\"status\":\"" + escape(lr.getStatus()) + "\"," +
                "\"cycleDeducted\":" + lr.isCycleDeducted() +
                "}";
    }

    private static String serializeStudentsList(ArrayList<Student> students) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < students.size(); i++) {
            Student s = students.get(i);
            if (i > 0) sb.append(",");
            sb.append(serializeStudent(s));
        }
        sb.append("]");
        return sb.toString();
    }

    private static String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    private static String buildErrorJson(int status, String errorCode, String message, String path) {
        String timestamp = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").format(new Date());
        return "{" +
                "\"success\":false," +
                "\"status\":" + status + "," +
                "\"error\":\"" + escape(errorCode) + "\"," +
                "\"message\":\"" + escape(message) + "\"," +
                "\"path\":\"" + escape(path) + "\"," +
                "\"timestamp\":\"" + timestamp + "\"" +
                "}";
    }

    private static String getClientIp(HttpExchange exchange) {
        String xff = exchange.getRequestHeaders().getFirst("X-Forwarded-For");
        if (xff != null && !xff.trim().isEmpty()) {
            int commaIdx = xff.indexOf(",");
            return commaIdx > 0 ? xff.substring(0, commaIdx).trim() : xff.trim();
        }
        if (exchange.getRemoteAddress() != null && exchange.getRemoteAddress().getAddress() != null) {
            return exchange.getRemoteAddress().getAddress().getHostAddress();
        }
        return "127.0.0.1";
    }

    private static String readBody(InputStream is) throws IOException {
        if (is == null) return "";
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[1024];
            int len;
            int total = 0;
            while ((len = is.read(buffer)) != -1) {
                total += len;
                if (total > MAX_BODY_SIZE) {
                    throw new ValidationException("Payload size exceeds maximum allowed limit of 1MB.");
                }
                baos.write(buffer, 0, len);
            }
            return baos.toString(StandardCharsets.UTF_8);
        }
    }

    private static Map<String, String> parseQueryParams(String query) {
        Map<String, String> params = new HashMap<>();
        if (query == null || query.isEmpty()) return params;
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            if (idx > 0) {
                params.put(pair.substring(0, idx), pair.substring(idx + 1));
            } else if (idx == 0) {
                params.put("", pair.substring(1));
            } else {
                params.put(pair, "");
            }
        }
        return params;
    }

    private static Map<String, String> parseSimpleJson(String json) {
        Map<String, String> map = new HashMap<>();
        if (json == null || json.trim().isEmpty()) return map;
        String trimmed = json.trim();
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
            trimmed = trimmed.substring(1, trimmed.length() - 1).trim();
        }
        // Tokenize comma-separated key-values respecting quotes
        List<String> entries = new ArrayList<>();
        StringBuilder cur = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < trimmed.length(); i++) {
            char c = trimmed.charAt(i);
            if (c == '\"') {
                inQuotes = !inQuotes;
                cur.append(c);
            } else if (c == ',' && !inQuotes) {
                entries.add(cur.toString().trim());
                cur = new StringBuilder();
            } else {
                cur.append(c);
            }
        }
        if (cur.length() > 0) {
            entries.add(cur.toString().trim());
        }

        for (String entry : entries) {
            int colonIdx = entry.indexOf(":");
            if (colonIdx > 0) {
                String key = entry.substring(0, colonIdx).trim();
                String val = entry.substring(colonIdx + 1).trim();
                if (key.startsWith("\"") && key.endsWith("\"")) {
                    key = key.substring(1, key.length() - 1);
                }
                if (val.startsWith("\"") && val.endsWith("\"")) {
                    val = val.substring(1, val.length() - 1);
                }
                map.put(key, val);
            }
        }
        return map;
    }
}
