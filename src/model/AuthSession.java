package model;

public class AuthSession {
    private String userId;
    private String currentOtp;
    private boolean isOtpVerified;
    private long loginTimestamp;
    private int sessionValidityDays;

    public AuthSession(String userId) {
        this.userId = userId;
        this.currentOtp = null;
        this.isOtpVerified = false;
        this.loginTimestamp = System.currentTimeMillis();
        this.sessionValidityDays = 10;
    }

    public String getUserId() {
        return userId;
    }

    public String getCurrentOtp() {
        return currentOtp;
    }

    public void setCurrentOtp(String currentOtp) {
        this.currentOtp = currentOtp;
    }

    public boolean isOtpVerified() {
        return isOtpVerified;
    }

    public void setOtpVerified(boolean otpVerified) {
        isOtpVerified = otpVerified;
    }

    public long getLoginTimestamp() {
        return loginTimestamp;
    }

    public int getSessionValidityDays() {
        return sessionValidityDays;
    }

    public boolean isSessionValid() {
        long elapsedDays = (System.currentTimeMillis() - loginTimestamp) / (1000L * 60 * 60 * 24);
        return isOtpVerified && (elapsedDays < sessionValidityDays);
    }
}
