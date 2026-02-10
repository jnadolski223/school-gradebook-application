package pl.edu.ug.schoolgradebook.dto;

import org.springframework.http.HttpStatus;

public record ApiError(
        int status,
        String error
) {
    public static ApiError of(HttpStatus status, String message) {
        return new ApiError(status.value(), message);
    }
}
