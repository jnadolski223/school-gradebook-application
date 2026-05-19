package pl.edu.ug.schoolgradebook.util.mapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.edu.ug.schoolgradebook.domain.Grade;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.domain.Student;
import pl.edu.ug.schoolgradebook.domain.Subject;
import pl.edu.ug.schoolgradebook.dto.grade.GradeRequest;
import pl.edu.ug.schoolgradebook.dto.grade.GradeResponse;
import pl.edu.ug.schoolgradebook.enums.GradeType;
import pl.edu.ug.schoolgradebook.enums.GradeValue;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class GradeMapperTests {

    private final GradeMapper mapper = new GradeMapper();

    @Test
    @DisplayName("Should correctly map GradeRequest DTO to Grade entity")
    void shouldMapRequestToEntity() {
        Student student = Student.builder()
                .schoolMemberId(UUID.randomUUID())
                .build();

        SchoolMember teacher = SchoolMember.builder()
                .userId(UUID.randomUUID())
                .build();

        Subject subject = Subject.builder()
                .id(UUID.randomUUID())
                .build();

        GradeRequest request = new GradeRequest(
                student.getSchoolMemberId(),
                teacher.getUserId(),
                subject.getId(),
                GradeValue.FIVE,
                GradeType.REGULAR_SEMESTER_1,
                10,
                true,
                "Final exam"
        );

        Grade grade = mapper.mapRequestToEntity(request, student, teacher, subject);

        assertThat(grade).isNotNull();
        assertThat(grade.getId()).isNull();
        assertThat(grade.getStudent()).isEqualTo(student);
        assertThat(grade.getTeacher()).isEqualTo(teacher);
        assertThat(grade.getSubject()).isEqualTo(subject);
        assertThat(grade.getGradeValue()).isEqualTo(request.gradeValue());
        assertThat(grade.getGradeType()).isEqualTo(request.gradeType());
        assertThat(grade.getWeight()).isEqualTo(request.weight());
        assertThat(grade.isCountToAverage()).isEqualTo(request.countToAverage());
        assertThat(grade.getCreatedAt()).isNull();
        assertThat(grade.getModifiedAt()).isNull();
        assertThat(grade.getDescription()).isEqualTo(request.description());
    }

    @Test
    @DisplayName("Should correctly map Grade entity to GradeResponse DTO")
    void shouldMapEntityToResponse() {
        Student student = Student.builder()
                .schoolMemberId(UUID.randomUUID())
                .build();

        SchoolMember teacher = SchoolMember.builder()
                .userId(UUID.randomUUID())
                .build();

        Subject subject = Subject.builder()
                .id(UUID.randomUUID())
                .build();

        Grade grade = Grade.builder()
                .id(UUID.randomUUID())
                .student(student)
                .teacher(teacher)
                .subject(subject)
                .gradeValue(GradeValue.FIVE)
                .gradeType(GradeType.REGULAR_SEMESTER_1)
                .weight(10)
                .countToAverage(true)
                .createdAt(Instant.now())
                .modifiedAt(Instant.now())
                .description("Final exam")
                .build();

        GradeResponse response = mapper.mapEntityToResponse(grade);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(grade.getId());
        assertThat(response.studentId()).isEqualTo(grade.getStudent().getSchoolMemberId());
        assertThat(response.teacherId()).isEqualTo(grade.getTeacher().getUserId());
        assertThat(response.subjectId()).isEqualTo(grade.getSubject().getId());
        assertThat(response.gradeValue()).isEqualTo(grade.getGradeValue());
        assertThat(response.gradeType()).isEqualTo(grade.getGradeType());
        assertThat(response.weight()).isEqualTo(grade.getWeight());
        assertThat(response.countToAverage()).isEqualTo(grade.isCountToAverage());
        assertThat(response.createdAt()).isEqualTo(grade.getCreatedAt());
        assertThat(response.modifiedAt()).isEqualTo(grade.getModifiedAt());
        assertThat(response.description()).isEqualTo(grade.getDescription());
    }
}
