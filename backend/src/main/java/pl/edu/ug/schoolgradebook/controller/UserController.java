package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.ApiResponse;
import pl.edu.ug.schoolgradebook.dto.user.UserLoginRequest;
import pl.edu.ug.schoolgradebook.dto.user.UserLoginResponse;
import pl.edu.ug.schoolgradebook.dto.user.UserRequest;
import pl.edu.ug.schoolgradebook.dto.user.UserResponse;
import pl.edu.ug.schoolgradebook.service.UserService;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(ApiPaths.USERS)
@RequiredArgsConstructor
public class UserController {
    private final UserService service;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(@RequestBody UserRequest request) {
        UserResponse user = service.registerUser(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created("User registered successfully", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserLoginResponse>> loginUser(@RequestBody UserLoginRequest request) {
        UserLoginResponse user = service.loginUser(request);
        return ResponseEntity.ok(ApiResponse.ok("User logged in successfully", user));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable UUID userId) {
        UserResponse user = service.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.ok("User retrieved successfully", user));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = service.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok("All users retrieved successfully", users));
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable UUID userId,
            @RequestBody UserRequest request
    ) {
        UserResponse user = service.updateUser(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("User updated successfully", user));
    }

    @PatchMapping("/{userId}/activate")
    public ResponseEntity<Void> activateUser(@PathVariable UUID userId) {
        service.activateUser(userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{userId}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable UUID userId) {
        service.deactivateUser(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID userId) {
        service.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
