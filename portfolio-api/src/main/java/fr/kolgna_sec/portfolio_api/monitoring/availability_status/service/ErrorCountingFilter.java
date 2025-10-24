package fr.kolgna_sec.portfolio_api.monitoring.availability_status.service;

import fr.kolgna_sec.portfolio_api.monitoring.availability_status.bean.HttpStatusCapturingWrapper;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;

@Component
public class ErrorCountingFilter implements Filter {

    private final Deque<Long> fiveXX = new ArrayDeque<>();

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpStatusCapturingWrapper wrapper = new HttpStatusCapturingWrapper((HttpServletResponse) res);
        chain.doFilter(req, wrapper);

        int status = wrapper.getStatus();
        if (status >= 500) {
            synchronized (fiveXX) {
                fiveXX.addLast(Instant.now().toEpochMilli());
                purgeOlderThanMillis(fiveXX, 60L * 60 * 1000); // garde ≤ 60 min
            }
        }
    }

    private void purgeOlderThanMillis(Deque<Long> q, long window) {
        long cutoff = Instant.now().toEpochMilli() - window;
        while (!q.isEmpty() && q.peekFirst() < cutoff) q.removeFirst();
    }

    public int countLastMinutes(int minutes) {
        long window = minutes * 60L * 1000L;
        long cutoff = Instant.now().toEpochMilli() - window;
        synchronized (fiveXX) {
            return (int) fiveXX.stream().filter(ts -> ts >= cutoff).count();
        }
    }
}

