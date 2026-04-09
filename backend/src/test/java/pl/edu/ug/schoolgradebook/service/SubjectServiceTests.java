package pl.edu.ug.schoolgradebook.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.domain.Subject;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectRequest;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectRequestName;
import pl.edu.ug.schoolgradebook.dto.subject.SubjectResponse;
import pl.edu.ug.schoolgradebook.exception.ConflictException;
import pl.edu.ug.schoolgradebook.repository.SchoolRepository;
import pl.edu.ug.schoolgradebook.repository.SubjectRepository;
import pl.edu.ug.schoolgradebook.util.mapper.SubjectMapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SubjectServiceTests {

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private SchoolRepository schoolRepository;

    @Mock
    private SubjectMapper mapper;

    @InjectMocks
    private SubjectService service;

    private UUID schoolId;
    private School school;

    private UUID id;
    private SubjectRequest request;
    private Subject subject;
    private SubjectResponse response;

    @BeforeEach
    void setUp() {
        schoolId = UUID.randomUUID();
        school = School.builder().id(schoolId).build();

        id = UUID.randomUUID();
        request = new SubjectRequest(schoolId, "Math");
        subject = Subject.builder()
                .id(id)
                .school(school)
                .name(request.name())
                .build();
        response = new SubjectResponse(
                subject.getId(),
                subject.getSchool().getId(),
                subject.getName()
        );
    }

    @Test
    @DisplayName("Should create a new subject")
    void shouldCreateSubject() {
        // Given
        when(schoolRepository.findById(schoolId)).thenReturn(Optional.of(school));
        when(subjectRepository.existsBySchoolIdAndNameIgnoreCase(schoolId, subject.getName())).thenReturn(false);
        when(mapper.mapRequestToEntity(request, school)).thenReturn(subject);
        when(subjectRepository.save(subject)).thenReturn(subject);
        when(mapper.mapEntityToResponse(subject)).thenReturn(response);

        // When
        SubjectResponse result = service.createSubject(request);

        // Then
        assertThat(result).isEqualTo(response);
        verify(subjectRepository).save(subject);
    }

    @Test
    @DisplayName("Should not create already existing subject in school")
    void shouldNotCreateAlreadyExistingSubjectInSchool() {
        // Given
        when(schoolRepository.findById(schoolId)).thenReturn(Optional.of(school));
        when(subjectRepository.existsBySchoolIdAndNameIgnoreCase(schoolId, subject.getName())).thenReturn(true);

        // When & Then
        assertThrows(ConflictException.class, () -> service.createSubject(request));
    }

    @Test
    @DisplayName("Should return subject by ID")
    void shouldReturnSubjectById() {
        // Given
        when(subjectRepository.findById(id)).thenReturn(Optional.of(subject));
        when(mapper.mapEntityToResponse(subject)).thenReturn(response);

        // When
        SubjectResponse result = service.getSubjectById(id);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(id);
        verify(subjectRepository).findById(id);
    }

    @Test
    @DisplayName("Should return all subjects with given schoolId")
    void shouldReturnAllSubjectWithGivenSchoolId() {
        // Given
        List<Subject> subjects = List.of(subject, subject);
        when(subjectRepository.findBySchoolId(schoolId)).thenReturn(subjects);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<SubjectResponse> results = service.getAllSubjectsBySchool(schoolId);

        // Then
        assertThat(results).hasSize(2);
        verify(subjectRepository).findBySchoolId(schoolId);
    }

    @Test
    @DisplayName("Should update subject name")
    void shouldUpdateSubjectName() {
        // Given
        SubjectRequestName updatedName = new SubjectRequestName("Computer science");
        when(subjectRepository.findById(id)).thenReturn(Optional.of(subject));
        when(mapper.mapEntityToResponse(subject)).thenReturn(response);

        // When
        service.updateSubjectName(id, updatedName);

        // Then
        assertThat(subject.getName()).isEqualTo(updatedName.name());
    }

    @Test
    @DisplayName("Should delete subject by ID")
    void shouldDeleteSubjectById() {
        // Given
        when(subjectRepository.findById(id)).thenReturn(Optional.of(subject));

        // When
        service.deleteSubject(id);

        // Then
        verify(subjectRepository).delete(subject);
    }
}
