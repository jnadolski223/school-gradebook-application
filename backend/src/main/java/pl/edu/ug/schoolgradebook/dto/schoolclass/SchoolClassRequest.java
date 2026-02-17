package pl.edu.ug.schoolgradebook.dto.schoolclass;

import java.util.UUID;

public record SchoolClassRequest(
        UUID schoolId,
        UUID homeroomTeacherId,
        String name
) {}
