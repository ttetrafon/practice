package com.ttetrafon.demo.configuration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
@Slf4j
public class RequestInterceptor implements HandlerInterceptor {
//    This class intercepts requests (which ones defined in ...), and accepts/rejects them.

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        var requestUriLowerCase = request.getRequestURI().toLowerCase();
        log.info("request intercepted: {}", requestUriLowerCase);

        return true;
    }
}
