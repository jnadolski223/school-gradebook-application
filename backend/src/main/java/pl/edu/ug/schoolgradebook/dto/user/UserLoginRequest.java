package pl.edu.ug.schoolgradebook.dto.user;

public record UserLoginRequest(
        String login,
        String password
) {}
