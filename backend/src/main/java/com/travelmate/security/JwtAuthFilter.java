package com.travelmate.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();
        System.out.println("🔍 [JwtAuthFilter] Request path: " + path);

        // ❌ NON applicare il filtro a rotte pubbliche
        if (path.startsWith("/api/auth")) {
            System.out.println("✅ [JwtAuthFilter] Public route, skipping authentication filter.");
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("❌ [JwtAuthFilter] Authorization header missing or invalid.");
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);
        System.out.println("🪙 [JwtAuthFilter] Bearer token: " + token);

        final String username = jwtUtils.extractUsername(token);
        System.out.println("🧑‍💻 [JwtAuthFilter] Username extracted from token: " + username);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            System.out.println("🔐 [JwtAuthFilter] Loaded user: " + userDetails.getUsername());

            if (jwtUtils.validateToken(token)) {
                System.out.println("✅ [JwtAuthFilter] Token is valid!");

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                System.out.println("❌ [JwtAuthFilter] Token validation failed!");
            }
        } else {
            System.out.println("⚠️ [JwtAuthFilter] Username null or already authenticated.");
        }

        filterChain.doFilter(request, response);
    }
}
