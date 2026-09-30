package com.stock.stock_trading_portfolio_system.controller;

import com.stock.stock_trading_portfolio_system.entity.User;
import com.stock.stock_trading_portfolio_system.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.stock.stock_trading_portfolio_system.service.JwtService;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
private final JwtService jwtService;

public AuthController(
        AuthService authService,
        JwtService jwtService) {

    this.authService = authService;
    this.jwtService = jwtService;
}
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        try {
            User user = authService.register(
                    request.fullName(),
                    request.email(),
                    request.password(),
                    request.phone()
            );

            return ResponseEntity.ok(toResponse(user));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {
           User user = authService.login(
        request.email(),
        request.password()
);

String token = jwtService.generateToken(
        user.getUserId(),
        user.getEmail(),
        user.getRole()
);

return ResponseEntity.ok(
        new LoginResponse(
                token,
                toResponse(user)
        )
);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    private AuthResponse toResponse(User user) {
        return new AuthResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }

    public record RegisterRequest(
            String fullName,
            String email,
            String password,
            String phone
    ) {}

    public record LoginRequest(
            String email,
            String password
    ) {}

    public record AuthResponse(
            Long userId,
            String fullName,
            String email,
            String phone,
            String role,
            String status,
            java.time.LocalDateTime createdAt
    ) {}
    public record LoginResponse(
        String token,
        AuthResponse user
) {}
}