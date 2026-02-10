package pl.edu.ug.schoolgradebook.dto.schoolclass;

import java.util.UUID;

public record SchoolClassResponse(
        UUID id,
        UUID schoolId,
        UUID homeroomTeacherId,
        String name
) {}
