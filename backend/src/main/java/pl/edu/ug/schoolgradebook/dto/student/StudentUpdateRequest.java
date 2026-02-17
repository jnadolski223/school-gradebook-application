package pl.edu.ug.schoolgradebook.dto.student;

import java.util.UUID;

public record StudentUpdateRequest(
        UUID schoolClassId,
        UUID parentId
) {}
