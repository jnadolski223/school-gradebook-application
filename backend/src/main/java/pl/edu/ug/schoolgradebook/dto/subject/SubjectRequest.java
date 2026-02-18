package pl.edu.ug.schoolgradebook.dto.subject;

import java.util.UUID;

public record SubjectRequest(
        UUID schoolId,
        String name
) {}
