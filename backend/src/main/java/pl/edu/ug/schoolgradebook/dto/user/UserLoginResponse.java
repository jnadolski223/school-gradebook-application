package pl.edu.ug.schoolgradebook.dto.user;

import pl.edu.ug.schoolgradebook.enums.UserRole;

import java.util.UUID;

public record UserLoginResponse(
        UUID id,
        String login,
        UserRole role
) {}
