package com.flowersupply.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Отключаем CSRF для API
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/**").permitAll()  // Разрешаем доступ ко всем API
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .cors(cors -> cors.configurationSource(request -> {
                var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                corsConfiguration.addAllowedOrigin("http://localhost:3000");
                corsConfiguration.addAllowedMethod("*");
                corsConfiguration.addAllowedHeader("*");
                corsConfiguration.setAllowCredentials(true);
                return corsConfiguration;
            }));
        
        return http.build();
    }
}