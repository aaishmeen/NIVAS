package service;

import model.AuthSession;
import model.User;
import java.util.Random;

public class AuthenticationService {
    private DataStore dataStore;
    private AuthSession activeSession;

    public AuthenticationService() {
        this.dataStore = DataStore.getInstance();
    }

    public User authenticateUser(String idOrEmail, String password) {
        for (User u : dataStore.getUsers()) {
            if ((u.getId().equalsIgnoreCase(idOrEmail) || u.getEmail().equalsIgnoreCase(idOrEmail))
                    && u.getPassword().equals(password)) {
                return u;
            }
            if (u instanceof model.Student) {
                model.Student s = (model.Student) u;
                if (s.getStudentId().equalsIgnoreCase(idOrEmail) && s.getPassword().equals(password)) {
                    return s;
                }
            }
        }
        return null;
    }

    public String generateOtp(String userId) {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        String otp = String.valueOf(code);

        activeSession = new AuthSession(userId);
        activeSession.setCurrentOtp(otp);

        System.out.println("----------------------------------------");
        System.out.println("OTP DISPATCH SIMULATION (Console Output)");
        System.out.println("A verification OTP has been sent.");
        System.out.println("Your 6-Digit OTP is: " + otp);
        System.out.println("----------------------------------------");

        return otp;
    }

    public boolean verifyOtp(String enteredOtp) {
        if (activeSession != null && activeSession.getCurrentOtp() != null) {
            if (activeSession.getCurrentOtp().equals(enteredOtp.trim())) {
                activeSession.setOtpVerified(true);
                return true;
            }
        }
        return false;
    }

    public AuthSession getActiveSession() {
        return activeSession;
    }

    public void logout() {
        activeSession = null;
    }
}
