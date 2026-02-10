package pl.edu.ug.schoolgradebook.dto.schoolmember;

import java.util.UUID;

public record SchoolMemberCreateRequest(
        UUID userId,
        UUID schoolId,
        String firstName,
        String lastName
) {}
