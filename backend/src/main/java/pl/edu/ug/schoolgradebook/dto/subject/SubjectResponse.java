package pl.edu.ug.schoolgradebook.dto.subject;

import java.util.UUID;

public record SubjectResponse(
        UUID id,
        UUID schoolId,
        String name
) {}
