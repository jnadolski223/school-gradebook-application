package pl.edu.ug.schoolgradebook.dto.schoolclass;

import java.util.UUID;

public record SchoolClassUpdateRequest(
        UUID homeroomTeacherId,
        String name
) {}
