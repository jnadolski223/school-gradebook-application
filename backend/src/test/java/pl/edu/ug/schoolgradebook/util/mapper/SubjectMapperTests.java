package pl.edu.ug.schoolgradebook.util.mapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.domain.Subject;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectRequest;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectResponse;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class SubjectMapperTests {

    private final SubjectMapper mapper = new SubjectMapper();

    @Test
    @DisplayName("Should correctly map SubjectRequest DTO to Subject entity")
    void shouldMapRequestToEntity() {
        School school = School.builder()
                .id(UUID.randomUUID())
                .build();

        SubjectRequest request = new SubjectRequest(
                school.getId(),
                "Mathematics"
        );

        Subject subject = mapper.mapRequestToEntity(request, school);

        assertThat(subject).isNotNull();
        assertThat(subject.getId()).isNull();
        assertThat(subject.getSchool()).isEqualTo(school);
        assertThat(subject.getName()).isEqualTo(request.name());
    }

    @Test
    @DisplayName("Should correctly map Subject entity to SubjectResponse DTO")
    void shouldMapEntityToResponse() {
        School school = School.builder()
                .id(UUID.randomUUID())
                .build();

        Subject subject = Subject.builder()
                .id(UUID.randomUUID())
                .school(school)
                .name("Mathematics")
                .build();

        SubjectResponse response = mapper.mapEntityToResponse(subject);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(subject.getId());
        assertThat(response.schoolId()).isEqualTo(subject.getSchool().getId());
        assertThat(response.name()).isEqualTo(subject.getName());
    }
}
