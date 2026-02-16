package pl.edu.ug.schoolgradebook.util.mapper;

import org.springframework.stereotype.Component;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.domain.Subject;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectRequest;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectResponse;

@Component
public class SubjectMapper {
    public Subject mapRequestToEntity(SubjectRequest request, School school) {
        return Subject.builder()
                .school(school)
                .name(request.name())
                .build();
    }

    public SubjectResponse mapEntityToResponse(Subject subject) {
        return new SubjectResponse(
                subject.getId(),
                subject.getSchool().getId(),
                subject.getName()
        );
    }
}
