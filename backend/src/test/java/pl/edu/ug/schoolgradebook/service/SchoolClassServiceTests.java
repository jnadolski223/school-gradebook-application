package pl.edu.ug.schoolgradebook.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.domain.SchoolClass;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.domain.User;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassRequest;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassResponse;
import pl.edu.ug.schoolgradebook.dto.schoolclass.SchoolClassUpdateRequest;
import pl.edu.ug.schoolgradebook.enums.UserRole;
import pl.edu.ug.schoolgradebook.exception.ConflictException;
import pl.edu.ug.schoolgradebook.repository.SchoolClassRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolMemberRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolRepository;
import pl.edu.ug.schoolgradebook.util.mapper.SchoolClassMapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SchoolClassServiceTests {

    @Mock
    private SchoolClassRepository schoolClassRepository;

    @Mock
    private SchoolRepository schoolRepository;

    @Mock
    private SchoolMemberRepository schoolMemberRepository;

    @Mock
    private SchoolClassMapper mapper;

    @InjectMocks
    private SchoolClassService service;

    private UUID schoolId;
    private School school;

    private UUID schoolMemberId;
    private SchoolMember schoolMember;

    private UUID id;
    private SchoolClassRequest request;
    private SchoolClass schoolClass;
    private SchoolClassResponse response;

    @BeforeEach
    void setUp() {
        schoolId = UUID.randomUUID();
        school = School.builder().id(schoolId).build();

        schoolMemberId = UUID.randomUUID();
        schoolMember = SchoolMember.builder()
                .userId(schoolMemberId)
                .user(User.builder().role(UserRole.TEACHER).build())
                .build();

        request = new SchoolClassRequest(schoolId, schoolMemberId, "1A");
        schoolClass = SchoolClass.builder()
                .id(id)
                .school(school)
                .homeroomTeacher(schoolMember)
                .name(request.name())
                .build();
        response = new SchoolClassResponse(
                schoolClass.getId(),
                schoolClass.getSchool().getId(),
                schoolClass.getHomeroomTeacher().getUserId(),
                schoolClass.getName()
        );
    }

    @Test
    @DisplayName("Should create a new school class")
    void shouldCreateSchoolClass() {
        // Given
        when(schoolRepository.findById(schoolId)).thenReturn(Optional.of(school));
        when(schoolMemberRepository.findById(schoolMemberId)).thenReturn(Optional.of(schoolMember));
        when(mapper.mapRequestToEntity(request, school, schoolMember)).thenReturn(schoolClass);
        when(schoolClassRepository.save(schoolClass)).thenReturn(schoolClass);
        when(mapper.mapEntityToResponse(schoolClass)).thenReturn(response);

        // When
        SchoolClassResponse result = service.createSchoolClass(request);

        // Then
        assertThat(result).isEqualTo(response);
        verify(schoolClassRepository).save(schoolClass);
    }

    @Test
    @DisplayName("Should throw ConflictException if school member is not a teacher")
    void shouldThrowExceptionIfMemberNotTeacher() {
        // Given
        schoolMember.getUser().setRole(UserRole.STUDENT);
        when(schoolRepository.findById(schoolId)).thenReturn(Optional.of(school));
        when(schoolMemberRepository.findById(schoolMemberId)).thenReturn(Optional.of(schoolMember));

        // When & Then
        assertThrows(ConflictException.class, () -> service.createSchoolClass(request));
    }

    @Test
    @DisplayName("Should return school class by ID")
    void shouldReturnSchoolClassById() {
        // Given
        when(schoolClassRepository.findById(id)).thenReturn(Optional.of(schoolClass));
        when(mapper.mapEntityToResponse(schoolClass)).thenReturn(response);

        // When
        SchoolClassResponse result = service.getSchoolClassById(id);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(id);
        verify(schoolClassRepository).findById(id);
    }

    @Test
    @DisplayName("Should return all school classes")
    void shouldReturnAllSchoolClasses() {
        // Given
        List<SchoolClass> schoolClasses = List.of(schoolClass, schoolClass);
        when(schoolClassRepository.findAll()).thenReturn(schoolClasses);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<SchoolClassResponse> results = service.getAllSchoolClasses();

        // Then
        assertThat(results).hasSize(2);
        verify(schoolClassRepository).findAll();
    }

    @Test
    @DisplayName("Should return all school classes with given schoolId")
    void shouldReturnAllSchoolClassesWithGivenSchoolId() {
        // Given
        List<SchoolClass> schoolClasses = List.of(schoolClass, schoolClass);
        when(schoolClassRepository.findBySchool_Id(schoolId)).thenReturn(schoolClasses);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<SchoolClassResponse> results = service.getAllSchoolClassesBySchoolId(schoolId);

        // Then
        assertThat(results).hasSize(2);
        verify(schoolClassRepository).findBySchool_Id(schoolId);
    }

    @Test
    @DisplayName("Should update school class")
    void shouldUpdateSchoolClass() {
        // Given
        UUID newSchoolMemberId = UUID.randomUUID();
        SchoolMember newSchoolMember = SchoolMember.builder()
                .userId(newSchoolMemberId)
                .user(User.builder().role(UserRole.TEACHER).build())
                .build();
        SchoolClassUpdateRequest updateRequest = new SchoolClassUpdateRequest(newSchoolMemberId, "2D");
        when(schoolClassRepository.findById(id)).thenReturn(Optional.of(schoolClass));
        when(schoolMemberRepository.findById(updateRequest.homeroomTeacherId())).thenReturn(Optional.of(newSchoolMember));
        when(mapper.mapEntityToResponse(schoolClass)).thenReturn(response);

        // When
        service.updateSchoolClass(id, updateRequest);

        // Then
        assertThat(schoolClass.getHomeroomTeacher().getUserId()).isEqualTo(newSchoolMemberId);
        assertThat(schoolClass.getName()).isEqualTo(updateRequest.name());
    }

    @Test
    @DisplayName("Should update only name of school class")
    void shouldUpdateOnlyNameOfSchoolClass() {
        // Given
        SchoolClassUpdateRequest updateRequest = new SchoolClassUpdateRequest(null, "2D");
        when(schoolClassRepository.findById(id)).thenReturn(Optional.of(schoolClass));
        when(mapper.mapEntityToResponse(schoolClass)).thenReturn(response);

        // When
        service.updateSchoolClass(id, updateRequest);

        // Then
        assertThat(schoolClass.getHomeroomTeacher().getUserId()).isEqualTo(schoolMemberId);
        assertThat(schoolClass.getName()).isEqualTo(updateRequest.name());
    }

    @Test
    @DisplayName("Should update only homeroom teacher of school class")
    void shouldUpdateOnlyHomeroomTeacherOfSchoolClass() {
        // Given
        UUID newSchoolMemberId = UUID.randomUUID();
        SchoolMember newSchoolMember = SchoolMember.builder()
                .userId(newSchoolMemberId)
                .user(User.builder().role(UserRole.TEACHER).build())
                .build();
        SchoolClassUpdateRequest updateRequest = new SchoolClassUpdateRequest(newSchoolMemberId, null);
        when(schoolClassRepository.findById(id)).thenReturn(Optional.of(schoolClass));
        when(schoolMemberRepository.findById(updateRequest.homeroomTeacherId())).thenReturn(Optional.of(newSchoolMember));
        when(mapper.mapEntityToResponse(schoolClass)).thenReturn(response);

        // When
        service.updateSchoolClass(id, updateRequest);

        // Then
        assertThat(schoolClass.getHomeroomTeacher().getUserId()).isEqualTo(newSchoolMemberId);
        assertThat(schoolClass.getName()).isEqualTo(request.name());
    }

    @Test
    @DisplayName("Should delete school class by ID")
    void shouldDeleteSchoolClassById() {
        // Given
        when(schoolClassRepository.findById(id)).thenReturn(Optional.of(schoolClass));

        // When
        service.deleteSchoolClass(id);

        // Then
        verify(schoolClassRepository).delete(schoolClass);
    }
}
