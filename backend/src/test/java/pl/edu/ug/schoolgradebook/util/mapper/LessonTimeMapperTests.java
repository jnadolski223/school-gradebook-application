package pl.edu.ug.schoolgradebook.util.mapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.edu.ug.schoolgradebook.domain.LessonTime;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.dto.lessontime.LessonTimeRequest;
import pl.edu.ug.schoolgradebook.dto.lessontime.LessonTimeResponse;

import java.time.LocalTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class LessonTimeMapperTests {

    private final LessonTimeMapper mapper = new LessonTimeMapper();

    @Test
    @DisplayName("Should correctly map LessonTimeRequest DTO to LessonTime entity")
    void shouldMapRequestToEntity() {
        School school = School.builder()
                .id(UUID.randomUUID())
                .build();

        LessonTimeRequest request = new LessonTimeRequest(
                school.getId(),
                LocalTime.of(8, 0),
                LocalTime.of(8, 45)
        );

        LessonTime lessonTime = mapper.mapRequestToEntity(request, school);

        assertThat(lessonTime).isNotNull();
        assertThat(lessonTime.getId()).isNull();
        assertThat(lessonTime.getSchool()).isEqualTo(school);
        assertThat(lessonTime.getLessonStart()).isEqualTo(request.lessonStart());
        assertThat(lessonTime.getLessonEnd()).isEqualTo(request.lessonEnd());
    }

    @Test
    @DisplayName("Should correctly map LessonTime entity to LessonTimeResponse DTO")
    void shouldMapEntityToResponse() {
        School school = School.builder()
                .id(UUID.randomUUID())
                .build();

        LessonTime lessonTime = LessonTime.builder()
                .id(UUID.randomUUID())
                .school(school)
                .lessonStart(LocalTime.of(8, 0))
                .lessonEnd(LocalTime.of(8, 45))
                .build();

        LessonTimeResponse response = mapper.mapEntityToResponse(lessonTime);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(lessonTime.getId());
        assertThat(response.schoolId()).isEqualTo(lessonTime.getSchool().getId());
        assertThat(response.lessonStart()).isEqualTo(lessonTime.getLessonStart());
        assertThat(response.lessonEnd()).isEqualTo(lessonTime.getLessonEnd());
    }
}
