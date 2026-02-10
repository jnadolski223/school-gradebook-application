package pl.edu.ug.schoolgradebook.dto.user;

import pl.edu.ug.schoolgradebook.enums.UserRole;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String login,
        UserRole role,
        Instant createdAt,
        Instant modifiedAt,
        boolean isActive
) {}
