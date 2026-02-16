package pl.edu.ug.schoolgradebook.util.mapper;

import org.springframework.stereotype.Component;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.dto.school.SchoolRequest;
import pl.edu.ug.schoolgradebook.dto.school.SchoolFullResponse;
import pl.edu.ug.schoolgradebook.dto.school.SchoolShortResponse;

@Component
public class SchoolMapper {
    public School mapRequestToEntity(SchoolRequest request) {
        return School.builder()
                .name(request.name())
                .street(request.street())
                .postalCode(request.postalCode())
                .city(request.city())
                .phoneNumber(request.phoneNumber())
                .email(request.email())
                .rspoNumber(request.rspoNumber())
                .build();
    }

    public SchoolFullResponse mapEntityToFullResponse(School school) {
        return new SchoolFullResponse(
                school.getId(),
                school.getName(),
                school.getStreet(),
                school.getPostalCode(),
                school.getCity(),
                school.getPhoneNumber(),
                school.getEmail(),
                school.getRspoNumber(),
                school.getCreatedAt(),
                school.getModifiedAt(),
                school.isActive()
        );
    }

    public SchoolShortResponse mapEntityToShortResponse(School school) {
        return new SchoolShortResponse(
                school.getId(),
                school.getName(),
                school.getCreatedAt(),
                school.getModifiedAt(),
                school.isActive()
        );
    }
}
