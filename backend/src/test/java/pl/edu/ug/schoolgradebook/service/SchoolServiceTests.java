package pl.edu.ug.schoolgradebook.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.dto.school.SchoolFullResponse;
import pl.edu.ug.schoolgradebook.dto.school.SchoolRequest;
import pl.edu.ug.schoolgradebook.dto.school.SchoolShortResponse;
import pl.edu.ug.schoolgradebook.enums.UserRole;
import pl.edu.ug.schoolgradebook.exception.EntityNotFoundException;
import pl.edu.ug.schoolgradebook.repository.SchoolMemberRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolRepository;
import pl.edu.ug.schoolgradebook.util.mapper.SchoolMapper;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SchoolServiceTests {

    @Mock
    private SchoolRepository repository;

    @Mock
    private SchoolMemberRepository schoolMemberRepository;

    @Mock
    private SchoolMapper mapper;

    @InjectMocks
    private SchoolService service;

    private UUID id;
    private SchoolRequest request;
    private School school;
    private SchoolFullResponse fullResponse;
    private SchoolShortResponse shortResponse;

    @BeforeEach
    void setUp() {
        id = UUID.randomUUID();

        request = new SchoolRequest(
                "High School No. 1",
                "Main Street 123",
                "00-001",
                "Gdansk",
                "+48123456789",
                "high.school.1@example.com",
                "123456"
        );

        school = School.builder()
                .id(id)
                .name(request.name())
                .street(request.street())
                .postalCode(request.postalCode())
                .city(request.city())
                .phoneNumber(request.phoneNumber())
                .email(request.email())
                .rspoNumber(request.rspoNumber())
                .createdAt(Instant.now())
                .modifiedAt(Instant.now())
                .isActive(true)
                .build();

        fullResponse = new SchoolFullResponse(
                school.getId(),
                school.getName(),
                school.getStreet(),
                school.getPostalCode(),
                school.getCity(),
                school.getPhoneNumber(),
                school.getEmail(),
                school.getRspoNumber(),
                school.getCreatedAt(),
                school.getModifiedAt(),
                school.isActive()
        );

        shortResponse = new SchoolShortResponse(
                school.getId(),
                school.getName(),
                school.getCreatedAt(),
                school.getModifiedAt(),
                school.isActive()
        );
    }

    @Test
    @DisplayName("Should create a new school")
    void shouldCreateSchool() {
        // Given
        when(mapper.mapRequestToEntity(request)).thenReturn(school);
        when(repository.save(school)).thenReturn(school);
        when(mapper.mapEntityToFullResponse(school)).thenReturn(fullResponse);

        // When
        SchoolFullResponse result = service.createSchool(request);

        // Then
        assertThat(result).isEqualTo(fullResponse);
        verify(repository).save(school);
    }

    @Test
    @DisplayName("Should return school by ID")
    void shouldGetSchoolById() {
        // Given
        when(repository.findById(id)).thenReturn(Optional.of(school));
        when(mapper.mapEntityToFullResponse(school)).thenReturn(fullResponse);

        // When
        SchoolFullResponse result = service.getSchoolById(id);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(id);
        verify(repository).findById(id);
    }

    @Test
    @DisplayName("Should throw EntityNotFoundException when school does not exist while searching")
    void shouldThrowExceptionWhenSearchingNonExistentSchool() {
        // Given
        when(repository.findById(id)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> service.getSchoolById(id));
    }

    @Test
    @DisplayName("Should return list of all schools")
    void shouldReturnListOfAllSchools() {
        // Given
        List<School> schools = List.of(school, school);
        when(repository.findAll()).thenReturn(schools);
        when(mapper.mapEntityToShortResponse(any())).thenReturn(shortResponse);

        // When
        List<SchoolShortResponse> results = service.getAllSchools();

        // Then
        assertThat(results).hasSize(2);
        verify(repository).findAll();
    }

    @Test
    @DisplayName("Should update school data")
    void shouldUpdateSchool() {
        // Given
        when(repository.findById(id)).thenReturn(Optional.of(school));
        when(mapper.mapEntityToFullResponse(school)).thenReturn(fullResponse);
        SchoolRequest newRequest = new SchoolRequest(
                "High School No. 2",
                "Main Street 420",
                "99-999",
                "Warsaw",
                "+48987654321",
                "high.school.2@mail.com",
                "123654"
        );

        // When
        service.updateSchool(id, newRequest);

        // Then
        assertThat(school.getName()).isEqualTo(newRequest.name());
        assertThat(school.getStreet()).isEqualTo(newRequest.street());
        assertThat(school.getPostalCode()).isEqualTo(newRequest.postalCode());
        assertThat(school.getCity()).isEqualTo(newRequest.city());
        assertThat(school.getPhoneNumber()).isEqualTo(newRequest.phoneNumber());
        assertThat(school.getEmail()).isEqualTo(newRequest.email());
        assertThat(school.getRspoNumber()).isEqualTo(newRequest.rspoNumber());
    }

    @Test
    @DisplayName("Should delete school by ID")
    void shouldDeleteSchoolById() {
        // Given
        when(repository.findById(id)).thenReturn(Optional.of(school));

        // When
        service.deleteSchool(id);

        // Then
        verify(repository).delete(school);
    }

    @Test
    @DisplayName("Should throw EntityNotFoundException when school does not exist while deleting")
    void shouldThrowExceptionWhenDeletingNonExistentSchool() {
        // Given
        when(repository.findById(id)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> service.deleteSchool(id));
        verify(repository, never()).delete(any());
    }

    @Test
    @DisplayName("Should change school active to true")
    void shouldActivateSchool() {
        // Given
        when(repository.findById(id)).thenReturn(Optional.of(school));

        // When
        service.activateSchool(id);

        // Then
        assertThat(school.isActive()).isTrue();
    }

    @Test
    @DisplayName("Should change school active to false")
    void shouldDeactivateSchool() {
        // Given
        when(repository.findById(id)).thenReturn(Optional.of(school));

        // When
        service.deactivateSchool(id);

        // Then
        assertThat(school.isActive()).isFalse();
    }

    @Test
    @DisplayName("Should return true if school administrator is created for school")
    void shouldReturnTrueIfSchoolAdministratorIsCreated() {
        // Given
        when(schoolMemberRepository.existsBySchool_IdAndUser_Role(id, UserRole.SCHOOL_ADMINISTRATOR)).thenReturn(true);

        // When
        boolean result = service.isSchoolAdminCreated(id);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("Should return false if school administrator is created for school")
    void shouldReturnTrueIfSchoolAdministratorIsNotCreated() {
        // Given
        when(schoolMemberRepository.existsBySchool_IdAndUser_Role(id, UserRole.SCHOOL_ADMINISTRATOR)).thenReturn(false);

        // When
        boolean result = service.isSchoolAdminCreated(id);

        // Then
        assertThat(result).isFalse();
    }
}
