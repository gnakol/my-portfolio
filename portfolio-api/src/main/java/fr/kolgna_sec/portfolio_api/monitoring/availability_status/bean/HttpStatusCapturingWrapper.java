package fr.kolgna_sec.portfolio_api.monitoring.availability_status.bean;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;

public class HttpStatusCapturingWrapper extends HttpServletResponseWrapper {
    private int httpStatus = 200;
    public HttpStatusCapturingWrapper(HttpServletResponse response) { super(response); }
    @Override public void setStatus(int sc) { super.setStatus(sc); this.httpStatus = sc; }
    @Override public void sendError(int sc) { this.httpStatus = sc; try { super.sendError(sc); } catch (Exception ignored) {} }
    @Override public void sendError(int sc, String msg) { this.httpStatus = sc; try { super.sendError(sc, msg); } catch (Exception ignored) {} }
    public int getStatus() { return httpStatus; }
}

