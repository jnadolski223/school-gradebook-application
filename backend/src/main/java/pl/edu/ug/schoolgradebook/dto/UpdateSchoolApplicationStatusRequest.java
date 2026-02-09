package pl.edu.ug.schoolgradebook.dto;

import pl.edu.ug.schoolgradebook.enums.SchoolApplicationStatus;

public record UpdateSchoolApplicationStatusRequest(
        SchoolApplicationStatus status
) {}
