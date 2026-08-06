package com.polancos.sushi.config;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Cookie[] cookies = request.getCookies();
        boolean authenticated = false;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("admin_session".equals(cookie.getName()) && "authenticated".equals(cookie.getValue())) {
                    authenticated = true;
                    break;
                }
            }
        }

        if (!authenticated) {
            String uri = request.getRequestURI();
            if (uri.startsWith("/api/admin/")) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=utf-8");
                response.getWriter().write("{\"result\":\"error\",\"error\":\"No autorizado. Por favor inicie sesión.\"}");
            } else {
                response.sendRedirect("/admin/login.html");
            }
            return false;
        }

        return true;
    }
}
