package pl.edu.ug.schoolgradebook.util.mapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.edu.ug.schoolgradebook.domain.*;
import pl.edu.ug.schoolgradebook.dto.lesson.LessonRequest;
import pl.edu.ug.schoolgradebook.dto.lesson.LessonResponse;
import pl.edu.ug.schoolgradebook.enums.DayOfWeek;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class LessonMapperTests {

    private final LessonMapper mapper = new LessonMapper();

    @Test
    @DisplayName("Should correctly map LessonRequest DTO to Lesson entity")
    void shouldMapRequestToEntity() {
        SchoolMember teacher = SchoolMember.builder()
                .userId(UUID.randomUUID())
                .build();

        SchoolClass schoolClass = SchoolClass.builder()
                .id(UUID.randomUUID())
                .build();

        Subject subject = Subject.builder()
                .id(UUID.randomUUID())
                .build();

        LessonTime lessonTime = LessonTime.builder()
                .id(UUID.randomUUID())
                .build();

        LessonRequest request = new LessonRequest(
                teacher.getUserId(),
                schoolClass.getId(),
                subject.getId(),
                "100A",
                lessonTime.getId(),
                DayOfWeek.MONDAY
        );

        Lesson lesson = mapper.mapRequestToEntity(request, teacher, schoolClass, subject, lessonTime);

        assertThat(lesson).isNotNull();
        assertThat(lesson.getId()).isNull();
        assertThat(lesson.getTeacher()).isEqualTo(teacher);
        assertThat(lesson.getSchoolClass()).isEqualTo(schoolClass);
        assertThat(lesson.getSubject()).isEqualTo(subject);
        assertThat(lesson.getRoom()).isEqualTo(request.room());
        assertThat(lesson.getLessonTime()).isEqualTo(lessonTime);
        assertThat(lesson.getDay()).isEqualTo(request.day());
    }

    @Test
    @DisplayName("Should correctly map Lesson entity to LessonResponse DTO")
    void shouldMapEntityToResponse() {
        SchoolMember teacher = SchoolMember.builder()
                .userId(UUID.randomUUID())
                .build();

        SchoolClass schoolClass = SchoolClass.builder()
                .id(UUID.randomUUID())
                .build();

        Subject subject = Subject.builder()
                .id(UUID.randomUUID())
                .build();

        LessonTime lessonTime = LessonTime.builder()
                .id(UUID.randomUUID())
                .build();

        Lesson lesson = Lesson.builder()
                .id(UUID.randomUUID())
                .teacher(teacher)
                .schoolClass(schoolClass)
                .subject(subject)
                .room("100A")
                .lessonTime(lessonTime)
                .day(DayOfWeek.MONDAY)
                .build();

        LessonResponse response = mapper.mapEntityToResponse(lesson);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(lesson.getId());
        assertThat(response.teacherId()).isEqualTo(lesson.getTeacher().getUserId());
        assertThat(response.schoolClassId()).isEqualTo(lesson.getSchoolClass().getId());
        assertThat(response.subjectId()).isEqualTo(lesson.getSubject().getId());
        assertThat(response.room()).isEqualTo(lesson.getRoom());
        assertThat(response.lessonTimeId()).isEqualTo(lesson.getLessonTime().getId());
        assertThat(response.day()).isEqualTo(lesson.getDay());
    }
}
