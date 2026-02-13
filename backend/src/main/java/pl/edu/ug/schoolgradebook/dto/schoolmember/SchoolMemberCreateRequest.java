package pl.edu.ug.schoolgradebook.dto.schoolmember;

import pl.edu.ug.schoolgradebook.enums.UserRole;

import java.util.UUID;

public record SchoolMemberCreateRequest(
        UUID schoolId,
        String login,
        String password,
        String firstName,
        String lastName,
        UserRole role
) {}
