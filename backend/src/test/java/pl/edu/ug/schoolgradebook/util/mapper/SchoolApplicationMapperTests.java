package pl.edu.ug.schoolgradebook.util.mapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.edu.ug.schoolgradebook.domain.SchoolApplication;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationFullResponse;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationRequest;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationShortResponse;
import pl.edu.ug.schoolgradebook.enums.SchoolApplicationStatus;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class SchoolApplicationMapperTests {

    private final SchoolApplicationMapper mapper = new SchoolApplicationMapper();

    @Test
    @DisplayName("Should correctly map SchoolApplicationRequest DTO to SchoolApplication entity")
    void shouldMapRequestToEntity() {
        SchoolApplicationRequest request = new SchoolApplicationRequest(
                "John",
                "Doe",
                "john.doe@example.com",
                "High School No. 1",
                "Main Street 123",
                "00-001",
                "Gdansk",
                "123456",
                "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus."
        );

        SchoolApplication application = mapper.mapRequestToEntity(request);

        assertThat(application).isNotNull();
        assertThat(application.getId()).isNull();
        assertThat(application.getSenderFirstName()).isEqualTo(request.senderFirstName());
        assertThat(application.getSenderLastName()).isEqualTo(request.senderLastName());
        assertThat(application.getSenderEmail()).isEqualTo(request.senderEmail());
        assertThat(application.getSchoolName()).isEqualTo(request.schoolName());
        assertThat(application.getSchoolStreet()).isEqualTo(request.schoolStreet());
        assertThat(application.getSchoolPostalCode()).isEqualTo(request.schoolPostalCode());
        assertThat(application.getSchoolCity()).isEqualTo(request.schoolCity());
        assertThat(application.getRspoNumber()).isEqualTo(request.rspoNumber());
        assertThat(application.getDescription()).isEqualTo(request.description());
        assertThat(application.getCreatedAt()).isNull();
        assertThat(application.getStatus()).isEqualTo(SchoolApplicationStatus.PENDING);
    }

    @Test
    @DisplayName("Should correctly map SchoolApplication entity to SchoolApplicationFullResponse DTO")
    void shouldMapEntityToFullResponse() {
        SchoolApplication application = SchoolApplication.builder()
                .id(UUID.randomUUID())
                .senderFirstName("John")
                .senderLastName("Doe")
                .senderEmail("john.doe@example.com")
                .schoolName("High School No. 1")
                .schoolStreet("Main Street 123")
                .schoolPostalCode("00-001")
                .schoolCity("Gdansk")
                .rspoNumber("123456")
                .description("Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus.")
                .createdAt(Instant.now())
                .status(SchoolApplicationStatus.PENDING)
                .build();

        SchoolApplicationFullResponse response = mapper.mapEntityToFullResponse(application);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(application.getId());
        assertThat(response.senderFirstName()).isEqualTo(application.getSenderFirstName());
        assertThat(response.senderLastName()).isEqualTo(application.getSenderLastName());
        assertThat(response.senderEmail()).isEqualTo(application.getSenderEmail());
        assertThat(response.schoolName()).isEqualTo(application.getSchoolName());
        assertThat(response.schoolStreet()).isEqualTo(application.getSchoolStreet());
        assertThat(response.schoolPostalCode()).isEqualTo(application.getSchoolPostalCode());
        assertThat(response.schoolCity()).isEqualTo(application.getSchoolCity());
        assertThat(response.rspoNumber()).isEqualTo(application.getRspoNumber());
        assertThat(response.description()).isEqualTo(application.getDescription());
        assertThat(response.createdAt()).isEqualTo(application.getCreatedAt());
        assertThat(response.status()).isEqualTo(application.getStatus());
    }

    @Test
    @DisplayName("Should correctly map SchoolApplication entity to SchoolApplicationShortResponse DTO")
    void shouldMapEntityToShortResponse() {
        SchoolApplication application = SchoolApplication.builder()
                .id(UUID.randomUUID())
                .schoolName("High School No. 1")
                .createdAt(Instant.now())
                .status(SchoolApplicationStatus.APPROVED)
                .build();

        SchoolApplicationShortResponse response = mapper.mapEntityToShortResponse(application);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(application.getId());
        assertThat(response.schoolName()).isEqualTo(application.getSchoolName());
        assertThat(response.createdAt()).isEqualTo(application.getCreatedAt());
        assertThat(response.status()).isEqualTo(application.getStatus());
    }
}
