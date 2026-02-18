package pl.edu.ug.schoolgradebook.dto.student;

import pl.edu.ug.schoolgradebook.enums.UserRole;

import java.util.UUID;

public record StudentResponse(
        UUID schoolMemberId,
        UUID schoolClassId,
        UUID parentId,
        UUID schoolId,
        String login,
        String firstName,
        String lastName,
        UserRole role
) {}
