package pl.edu.ug.schoolgradebook.util.mapper;

import org.springframework.stereotype.Component;
import pl.edu.ug.schoolgradebook.domain.Grade;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.domain.Student;
import pl.edu.ug.schoolgradebook.domain.Subject;
import pl.edu.ug.schoolgradebook.dto.grade.GradeRequest;
import pl.edu.ug.schoolgradebook.dto.grade.GradeResponse;

@Component
public class GradeMapper {
    public Grade mapRequestToEntity(GradeRequest request, Student student, SchoolMember teacher, Subject subject) {
        return Grade.builder()
                .student(student)
                .teacher(teacher)
                .subject(subject)
                .gradeValue(request.gradeValue())
                .gradeType(request.gradeType())
                .weight(request.weight())
                .countToAverage(request.countToAverage())
                .description(request.description())
                .build();
    }

    public GradeResponse mapEntityToResponse(Grade grade) {
        return new GradeResponse(
                grade.getId(),
                grade.getStudent().getSchoolMemberId(),
                grade.getTeacher().getUserId(),
                grade.getSubject().getId(),
                grade.getGradeValue(),
                grade.getGradeType(),
                grade.getWeight(),
                grade.isCountToAverage(),
                grade.getCreatedAt(),
                grade.getModifiedAt(),
                grade.getDescription()
        );
    }
}
