package pl.edu.ug.schoolgradebook.util.mapper;

import org.springframework.stereotype.Component;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.domain.SchoolClass;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassRequest;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassResponse;

@Component
public class SchoolClassMapper {
    public SchoolClass mapRequestToEntity(SchoolClassRequest request, School school, SchoolMember teacher) {
        return SchoolClass.builder()
                .school(school)
                .homeroomTeacher(teacher)
                .name(request.name())
                .build();
    }

    public SchoolClassResponse mapEntityToResponse(SchoolClass schoolClass) {
        return new SchoolClassResponse(
                schoolClass.getId(),
                schoolClass.getSchool().getId(),
                schoolClass.getHomeroomTeacher().getUserId(),
                schoolClass.getName()
        );
    }
}
