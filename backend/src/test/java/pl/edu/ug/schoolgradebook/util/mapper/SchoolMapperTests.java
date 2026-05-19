package pl.edu.ug.schoolgradebook.util.mapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.dto.school.SchoolFullResponse;
import pl.edu.ug.schoolgradebook.dto.school.SchoolRequest;
import pl.edu.ug.schoolgradebook.dto.school.SchoolShortResponse;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class SchoolMapperTests {

    private final SchoolMapper mapper = new SchoolMapper();

    @Test
    @DisplayName("Should correctly map SchoolRequest DTO to School entity")
    void shouldMapRequestToEntity() {
        SchoolRequest request = new SchoolRequest(
                "High School No. 1",
                "Main Street 123",
                "00-001",
                "Gdansk",
                "+48123456789",
                "high.school.1@example.com",
                "123456"
        );

        School school = mapper.mapRequestToEntity(request);

        assertThat(school).isNotNull();
        assertThat(school.getId()).isNull();
        assertThat(school.getName()).isEqualTo(request.name());
        assertThat(school.getStreet()).isEqualTo(request.street());
        assertThat(school.getPostalCode()).isEqualTo(request.postalCode());
        assertThat(school.getCity()).isEqualTo(request.city());
        assertThat(school.getPhoneNumber()).isEqualTo(request.phoneNumber());
        assertThat(school.getEmail()).isEqualTo(request.email());
        assertThat(school.getRspoNumber()).isEqualTo(request.rspoNumber());
        assertThat(school.getCreatedAt()).isNull();
        assertThat(school.getModifiedAt()).isNull();
        assertThat(school.isActive()).isTrue();
    }

    @Test
    @DisplayName("Should correctly map School entity to SchoolFullResponse DTO")
    void shouldMapEntityToFullResponse() {
        School school = School.builder()
                .id(UUID.randomUUID())
                .name("High School No. 1")
                .street("Main Street 123")
                .postalCode("00-001")
                .city("Gdansk")
                .phoneNumber("+48123456789")
                .email("high.school.1@example.com")
                .rspoNumber("123456")
                .createdAt(Instant.now())
                .modifiedAt(Instant.now())
                .isActive(true)
                .build();

        SchoolFullResponse response = mapper.mapEntityToFullResponse(school);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(school.getId());
        assertThat(response.name()).isEqualTo(school.getName());
        assertThat(response.street()).isEqualTo(school.getStreet());
        assertThat(response.postalCode()).isEqualTo(school.getPostalCode());
        assertThat(response.city()).isEqualTo(school.getCity());
        assertThat(response.phoneNumber()).isEqualTo(school.getPhoneNumber());
        assertThat(response.email()).isEqualTo(school.getEmail());
        assertThat(response.rspoNumber()).isEqualTo(school.getRspoNumber());
        assertThat(response.createdAt()).isEqualTo(school.getCreatedAt());
        assertThat(response.modifiedAt()).isEqualTo(school.getModifiedAt());
        assertThat(response.isActive()).isEqualTo(school.isActive());
    }

    @Test
    @DisplayName("Should correctly map School entity to SchoolShortResponse DTO")
    void shouldMapEntityToShortResponse() {
        School school = School.builder()
                .id(UUID.randomUUID())
                .name("High School No. 1")
                .createdAt(Instant.now())
                .modifiedAt(Instant.now())
                .isActive(true)
                .build();

        SchoolShortResponse response = mapper.mapEntityToShortResponse(school);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(school.getId());
        assertThat(response.name()).isEqualTo(school.getName());
        assertThat(response.createdAt()).isEqualTo(school.getCreatedAt());
        assertThat(response.modifiedAt()).isEqualTo(school.getModifiedAt());
        assertThat(response.isActive()).isEqualTo(school.isActive());
    }
}
