package pl.edu.ug.schoolgradebook.util.mapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.domain.SchoolClass;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassRequest;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassResponse;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class SchoolClassMapperTests {

    private final SchoolClassMapper mapper = new SchoolClassMapper();

    @Test
    @DisplayName("Should correctly map SchoolClassRequest DTO to SchoolClass entity")
    void shouldMapRequestToEntity() {
        School school = School.builder()
                .id(UUID.randomUUID())
                .build();

        SchoolMember teacher = SchoolMember.builder()
                .userId(UUID.randomUUID())
                .build();

        SchoolClassRequest request = new SchoolClassRequest(
                school.getId(),
                teacher.getUserId(),
                "1A"
        );

        SchoolClass schoolClass = mapper.mapRequestToEntity(request, school, teacher);

        assertThat(schoolClass).isNotNull();
        assertThat(schoolClass.getId()).isNull();
        assertThat(schoolClass.getSchool()).isEqualTo(school);
        assertThat(schoolClass.getHomeroomTeacher()).isEqualTo(teacher);
        assertThat(schoolClass.getName()).isEqualTo(request.name());
    }

    @Test
    @DisplayName("Should correctly map SchoolClass entity to SchoolClassResponse DTO")
    void shouldMapEntityToResponse() {
        School school = School.builder()
                .id(UUID.randomUUID())
                .build();

        SchoolMember homeroomTeacher = SchoolMember.builder()
                .userId(UUID.randomUUID())
                .build();

        SchoolClass schoolClass = SchoolClass.builder()
                .id(UUID.randomUUID())
                .school(school)
                .homeroomTeacher(homeroomTeacher)
                .name("1A")
                .build();

        SchoolClassResponse response = mapper.mapEntityToResponse(schoolClass);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(schoolClass.getId());
        assertThat(response.schoolId()).isEqualTo(schoolClass.getSchool().getId());
        assertThat(response.homeroomTeacherId()).isEqualTo(schoolClass.getHomeroomTeacher().getUserId());
        assertThat(response.name()).isEqualTo(schoolClass.getName());
    }
}
