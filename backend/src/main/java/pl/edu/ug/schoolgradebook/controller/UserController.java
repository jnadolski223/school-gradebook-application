package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.ApiResponse;
import pl.edu.ug.schoolgradebook.dto.user.*;
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
    public ResponseEntity<ApiResponse<UserResponse>> register(@RequestBody UserRegisterRequest request) {
        UserResponse user = service.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created("User registered successfully", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserLoginResponse>> login(@RequestBody UserLoginRequest request) {
        UserLoginResponse user = service.login(request);

        return ResponseEntity.ok(ApiResponse.ok("User logged in successfully", user));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsers(@RequestParam(required = false) Boolean active) {
        List<UserResponse> users = service.getUsers(active);
        String message;
        if (active == null) {
            message = "All users fetched successfully";
        } else if (active) {
            message = "All active users fetched successfully";
        } else {
            message = "All inactive users fetched successfully";
        }
        return ResponseEntity.ok(ApiResponse.ok(message, users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable UUID id) {
        UserResponse user = service.getUserById(id);
        return ResponseEntity.ok(ApiResponse.ok("User fetched successfully", user));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable UUID id, @RequestBody UserUpdateRequest request) {
        UserResponse user = service.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.ok("User updated successfully", user));
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> activate(@PathVariable UUID id) {
        service.activate(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivate(@PathVariable UUID id) {
        service.deactivate(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
