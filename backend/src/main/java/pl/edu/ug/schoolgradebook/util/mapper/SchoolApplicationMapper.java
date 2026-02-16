package pl.edu.ug.schoolgradebook.util.mapper;

import org.springframework.stereotype.Component;
import pl.edu.ug.schoolgradebook.domain.SchoolApplication;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationRequest;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationFullResponse;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationShortResponse;

@Component
public class SchoolApplicationMapper {
    public SchoolApplication mapRequestToEntity(SchoolApplicationRequest request) {
        return SchoolApplication.builder()
                .senderFirstName(request.senderFirstName())
                .senderLastName(request.senderLastName())
                .senderEmail(request.senderEmail())
                .schoolName(request.schoolName())
                .schoolStreet(request.schoolStreet())
                .schoolPostalCode(request.schoolPostalCode())
                .schoolCity(request.schoolCity())
                .rspoNumber(request.rspoNumber())
                .description(request.description())
                .build();
    }

    public SchoolApplicationFullResponse mapEntityToFullResponse(SchoolApplication application) {
        return new SchoolApplicationFullResponse(
                application.getId(),
                application.getSenderFirstName(),
                application.getSenderLastName(),
                application.getSenderEmail(),
                application.getSchoolName(),
                application.getSchoolStreet(),
                application.getSchoolPostalCode(),
                application.getSchoolCity(),
                application.getRspoNumber(),
                application.getDescription(),
                application.getCreatedAt(),
                application.getStatus()
        );
    }

    public SchoolApplicationShortResponse mapEntityToShortResponse(SchoolApplication application) {
        return new SchoolApplicationShortResponse(
                application.getId(),
                application.getSchoolName(),
                application.getCreatedAt(),
                application.getStatus()
        );
    }
}
