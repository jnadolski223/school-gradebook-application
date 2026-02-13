package pl.edu.ug.schoolgradebook.dto.schoolmember;

import pl.edu.ug.schoolgradebook.enums.UserRole;

import java.util.UUID;

public record SchoolMemberResponse(
        UUID userId,
        UUID schoolId,
        String login,
        String firstName,
        String lastName,
        UserRole role
) {}
