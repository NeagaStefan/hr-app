package org.example.hrappbackend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.stream.Collectors;

@Slf4j
@Component
public class LoggingInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        long startTime = System.currentTimeMillis();
        request.setAttribute("startTime", startTime);

        log.info("==> Incoming Request: {} {} from {}",
            request.getMethod(),
            request.getRequestURI(),
            request.getRemoteAddr());

        String queryString = request.getQueryString();
        if (queryString != null && !queryString.isEmpty()) {
            log.info("    Query Parameters: {}", queryString);
        }

        log.debug("    Headers: {}", Collections.list(request.getHeaderNames()).stream()
                .collect(Collectors.toMap(
                        headerName -> headerName,
                        headerValue -> Collections.list(request.getHeaders(headerValue))
                )));

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response,
                          Object handler, ModelAndView modelAndView) {
        if ("POST".equals(request.getMethod()) ||
            "PUT".equals(request.getMethod()) ||
            "PATCH".equals(request.getMethod())) {

            if (request instanceof ContentCachingRequestWrapper wrapper) {
                byte[] buf = wrapper.getContentAsByteArray();
                if (buf.length > 0) {
                    try {
                        String payload = new String(buf, 0, buf.length, StandardCharsets.UTF_8);
                        log.info("    Request Body (Object Content): {}", payload);
                    } catch (Exception e) {
                        log.warn("    Unable to log request body: {}", e.getMessage());
                    }
                }
            }
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                               Object handler, Exception ex) {
        long startTime = (Long) request.getAttribute("startTime");
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        log.info("<== Response: {} {} - Status: {} - Duration: {}ms",
            request.getMethod(),
            request.getRequestURI(),
            response.getStatus(),
            duration);

        if (ex != null) {
            log.error("    Exception occurred:", ex);
        }
    }
}