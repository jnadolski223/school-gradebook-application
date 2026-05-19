package pl.edu.ug.schoolgradebook.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.ug.schoolgradebook.domain.SchoolApplication;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationFullResponse;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationRequest;
import pl.edu.ug.schoolgradebook.dto.schoolapplication.SchoolApplicationShortResponse;
import pl.edu.ug.schoolgradebook.enums.SchoolApplicationStatus;
import pl.edu.ug.schoolgradebook.exception.EntityNotFoundException;
import pl.edu.ug.schoolgradebook.repository.SchoolApplicationRepository;
import pl.edu.ug.schoolgradebook.util.mapper.SchoolApplicationMapper;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SchoolApplicationServiceTests {

    @Mock
    private SchoolApplicationRepository repository;

    @Mock
    private SchoolApplicationMapper mapper;

    @InjectMocks
    private SchoolApplicationService service;

    private UUID id;
    private SchoolApplicationRequest request;
    private SchoolApplication application;
    private SchoolApplicationFullResponse fullResponse;
    private SchoolApplicationShortResponse shortResponse;

    @BeforeEach
    void setUp() {
        id = UUID.randomUUID();

        request = new SchoolApplicationRequest(
                "John",
                "Doe",
                "john.doe@example.com",
                "High School No. 1",
                "Main Street 123",
                "00-001",
                "Gdansk",
                "123456",
                "Lorem ipsum..."
        );

        application = SchoolApplication.builder()
                .id(id)
                .senderFirstName(request.senderFirstName())
                .senderLastName(request.senderLastName())
                .senderEmail(request.senderEmail())
                .schoolName(request.schoolName())
                .schoolStreet(request.schoolStreet())
                .schoolPostalCode(request.schoolPostalCode())
                .schoolCity(request.schoolCity())
                .rspoNumber(request.rspoNumber())
                .description(request.description())
                .createdAt(Instant.now())
                .status(SchoolApplicationStatus.PENDING)
                .build();

        fullResponse = new SchoolApplicationFullResponse(
                application.getId(),
                application.getSenderFirstName(),
                application.getSenderLastName(),
                application.getSenderEmail(),
                application.getSchoolName(),
                application.getSchoolStreet(),
                application.getSchoolPostalCode(),
                application.getSchoolCity(),
                application.getRspoNumber(),
                application.getDescription(),
                application.getCreatedAt(),
                application.getStatus()
        );

        shortResponse = new SchoolApplicationShortResponse(
                application.getId(),
                application.getSchoolName(),
                application.getCreatedAt(),
                application.getStatus()
        );
    }

    @Test
    @DisplayName("Should create a new school application")
    void shouldCreateSchoolApplication() {
        // Given
        when(mapper.mapRequestToEntity(request)).thenReturn(application);
        when(repository.save(application)).thenReturn(application);
        when(mapper.mapEntityToFullResponse(application)).thenReturn(fullResponse);

        // When
        SchoolApplicationFullResponse result = service.createSchoolApplication(request);

        // Then
        assertThat(result).isEqualTo(fullResponse);
        verify(repository).save(application);
    }

    @Test
    @DisplayName("Should return application by ID")
    void shouldGetSchoolApplicationById() {
        // Given
        when(repository.findById(id)).thenReturn(Optional.of(application));
        when(mapper.mapEntityToFullResponse(application)).thenReturn(fullResponse);

        // When
        SchoolApplicationFullResponse result = service.getSchoolApplicationById(id);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(id);
        verify(repository).findById(id);
    }

    @Test
    @DisplayName("Should throw EntityNotFoundException when application does not exist")
    void shouldThrowExceptionWhenSearchingNonExistentApplication() {
        // Given
        when(repository.findById(id)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> service.getSchoolApplicationById(id));
    }

    @Test
    @DisplayName("Should return list of all applications")
    void shouldReturnListOfAllApplications() {
        // Given
        List<SchoolApplication> applications = List.of(application, application);
        when(repository.findAll()).thenReturn(applications);
        when(mapper.mapEntityToShortResponse(any())).thenReturn(shortResponse);

        // When
        List<SchoolApplicationShortResponse> results = service.getAllSchoolApplications();

        // Then
        assertThat(results).hasSize(2);
        verify(repository).findAll();
    }

    @Test
    @DisplayName("Should change application status to APPROVED")
    void shouldUpdateSchoolApplicationStatus() {
        // Given
        when(repository.findById(id)).thenReturn(Optional.of(application));
        when(mapper.mapEntityToFullResponse(application)).thenReturn(fullResponse);

        // When
        service.updateSchoolApplicationStatus(id, SchoolApplicationStatus.APPROVED);

        // Then
        assertThat(application.getStatus()).isEqualTo(SchoolApplicationStatus.APPROVED);
    }

    @Test
    @DisplayName("Should delete application by ID")
    void shouldDeleteApplicationById() {
        // Given
        when(repository.findById(id)).thenReturn(Optional.of(application));

        // When
        service.deleteSchoolApplication(id);

        // Then
        verify(repository).delete(application);
    }

    @Test
    @DisplayName("Should throw EntityNotFoundException when school does not exist while deleting")
    void shouldThrowExceptionWhenDeletingNonExistentApplication() {
        // Given
        when(repository.findById(id)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> service.deleteSchoolApplication(id));
        verify(repository, never()).delete(any());
    }
}
