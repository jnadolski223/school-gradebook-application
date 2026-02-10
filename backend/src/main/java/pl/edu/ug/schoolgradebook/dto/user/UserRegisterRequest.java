package pl.edu.ug.schoolgradebook.dto.user;

import pl.edu.ug.schoolgradebook.enums.UserRole;

public record UserRegisterRequest(
        String login,
        String password,
        UserRole role
) {}
