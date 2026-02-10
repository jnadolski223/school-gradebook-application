package pl.edu.ug.schoolgradebook.dto.subject;

import java.util.UUID;

public record SubjectCreateRequest(
        UUID schoolId,
        String name
) {}
