package pl.edu.ug.schoolgradebook.dto.schoolclass;

import java.util.UUID;

public record SchoolClassCreateRequest(
        UUID schoolId,
        UUID homeroomTeacherId,
        String name
) {}
