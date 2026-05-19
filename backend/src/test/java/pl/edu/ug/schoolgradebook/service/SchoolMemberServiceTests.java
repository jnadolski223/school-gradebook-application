package pl.edu.ug.schoolgradebook.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.domain.User;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberRequest;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberResponse;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberUpdateRequest;
import pl.edu.ug.schoolgradebook.dto.user.UserRequest;
import pl.edu.ug.schoolgradebook.dto.user.UserResponse;
import pl.edu.ug.schoolgradebook.enums.UserRole;
import pl.edu.ug.schoolgradebook.exception.ConflictException;
import pl.edu.ug.schoolgradebook.repository.SchoolMemberRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolRepository;
import pl.edu.ug.schoolgradebook.repository.UserRepository;
import pl.edu.ug.schoolgradebook.util.mapper.SchoolMemberMapper;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SchoolMemberServiceTests {

    @Mock
    private SchoolMemberRepository schoolMemberRepository;

    @Mock
    private SchoolRepository schoolRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @Mock
    private SchoolMemberMapper mapper;

    @InjectMocks
    private SchoolMemberService schoolMemberService;

    private UUID schoolId;
    private School school;

    private UUID userId;
    private User user;

    private SchoolMemberRequest request;
    private SchoolMember schoolMember;
    private SchoolMemberResponse response;

    @BeforeEach
    void setUp() {
        schoolId = UUID.randomUUID();
        school = School.builder().id(schoolId).build();

        userId = UUID.randomUUID();
        user = User.builder()
                .id(userId)
                .login("john-doe-123")
                .password("test123")
                .role(UserRole.TEACHER)
                .build();

        request = new SchoolMemberRequest(
                schoolId,
                user.getLogin(),
                user.getPassword(),
                "John",
                "Doe",
                user.getRole()
        );
        schoolMember = SchoolMember.builder()
                .userId(user.getId())
                .user(user)
                .school(school)
                .firstName(request.firstName())
                .lastName(request.lastName())
                .build();
        response = new SchoolMemberResponse(
                schoolMember.getUserId(),
                schoolMember.getSchool().getId(),
                schoolMember.getUser().getLogin(),
                schoolMember.getFirstName(),
                schoolMember.getLastName(),
                schoolMember.getUser().getRole()
        );
    }

    @Test
    @DisplayName("Should create a new school member")
    void shouldCreateSchoolMember() {
        // Given
        UserRequest userRequest = new UserRequest(
                user.getLogin(),
                user.getPassword(),
                user.getRole()
        );
        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getLogin(),
                user.getRole(),
                Instant.now(),
                Instant.now(),
                true
        );
        when(userService.registerUser(userRequest)).thenReturn(userResponse);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(schoolRepository.findById(schoolId)).thenReturn(Optional.of(school));
        when(schoolMemberRepository.existsById(userId)).thenReturn(false);
        when(mapper.mapRequestToEntity(request, user, school)).thenReturn(schoolMember);
        when(schoolMemberRepository.save(schoolMember)).thenReturn(schoolMember);
        when(mapper.mapEntityToResponse(schoolMember)).thenReturn(response);

        // When
        SchoolMemberResponse result = schoolMemberService.createSchoolMember(request);

        // Then
        assertThat(result).isEqualTo(response);
        verify(schoolMemberRepository).save(schoolMember);
    }

    @Test
    @DisplayName("Should throw ConflictException if user is already a school member")
    void shouldThrowExceptionIfUserIsAlreadySchoolMember() {
        // Given
        UserRequest userRequest = new UserRequest(
                user.getLogin(),
                user.getPassword(),
                user.getRole()
        );
        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getLogin(),
                user.getRole(),
                Instant.now(),
                Instant.now(),
                true
        );
        when(userService.registerUser(userRequest)).thenReturn(userResponse);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(schoolRepository.findById(schoolId)).thenReturn(Optional.of(school));
        when(schoolMemberRepository.existsById(userId)).thenReturn(true);

        // When & Then
        assertThrows(ConflictException.class, () -> schoolMemberService.createSchoolMember(request));
    }

    @Test
    @DisplayName("Should return school member by ID")
    void shouldReturnSchoolMemberById() {
        // Given
        when(schoolMemberRepository.findById(userId)).thenReturn(Optional.of(schoolMember));
        when(mapper.mapEntityToResponse(schoolMember)).thenReturn(response);

        // When
        SchoolMemberResponse result = schoolMemberService.getSchoolMemberById(userId);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.userId()).isEqualTo(userId);
        verify(schoolMemberRepository).findById(userId);
    }

    @Test
    @DisplayName("Should return all school members")
    void shouldReturnAllSchoolMembers() {
        // Given
        List<SchoolMember> schoolMembers = List.of(schoolMember, schoolMember);
        when(schoolMemberRepository.findAll()).thenReturn(schoolMembers);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<SchoolMemberResponse> results = schoolMemberService.getAllSchoolMembers();

        // Then
        assertThat(results).hasSize(2);
        verify(schoolMemberRepository).findAll();
    }

    @Test
    @DisplayName("Should return all school members with given schoolId")
    void shouldReturnAllSchoolMembersWithGivenSchoolId() {
        // Given
        List<SchoolMember> schoolMembers = List.of(schoolMember, schoolMember);
        when(schoolMemberRepository.findBySchool_Id(schoolId)).thenReturn(schoolMembers);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<SchoolMemberResponse> results = schoolMemberService.getAllSchoolMembersBySchoolId(schoolId);

        // Then
        assertThat(results).hasSize(2);
        verify(schoolMemberRepository).findBySchool_Id(schoolId);
    }

    @Test
    @DisplayName("Should return all school members with given schoolId and role")
    void shouldReturnAllSchoolMembersWithGivenSchoolIdAndRole() {
        // Given
        UserRole role = UserRole.TEACHER;
        List<SchoolMember> schoolMembers = List.of(schoolMember, schoolMember);
        when(schoolMemberRepository.findBySchool_IdAndUser_Role(schoolId, role)).thenReturn(schoolMembers);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<SchoolMemberResponse> results = schoolMemberService.getAllSchoolMembersBySchoolIdAndUserRole(schoolId, role);

        // Then
        assertThat(results).hasSize(2);
        verify(schoolMemberRepository).findBySchool_IdAndUser_Role(schoolId, role);
    }

    @Test
    @DisplayName("Should update first and last name of school member")
    void shouldUpdateFirstAndLastNameOfSchoolMember() {
        // Given
        SchoolMemberUpdateRequest updateRequest = new SchoolMemberUpdateRequest("Mark", "Smith");
        when(schoolMemberRepository.findById(userId)).thenReturn(Optional.of(schoolMember));
        when(mapper.mapEntityToResponse(schoolMember)).thenReturn(response);

        // When
        schoolMemberService.updateSchoolMember(userId, updateRequest);

        // Then
        assertThat(schoolMember.getFirstName()).isEqualTo(updateRequest.firstName());
        assertThat(schoolMember.getLastName()).isEqualTo(updateRequest.lastName());
    }

    @Test
    @DisplayName("Should update only first name of school member")
    void shouldUpdateOnlyFirstNameOfSchoolMember() {
        // Given
        SchoolMemberUpdateRequest updateRequest = new SchoolMemberUpdateRequest("Mark", null);
        when(schoolMemberRepository.findById(userId)).thenReturn(Optional.of(schoolMember));
        when(mapper.mapEntityToResponse(schoolMember)).thenReturn(response);

        // When
        schoolMemberService.updateSchoolMember(userId, updateRequest);

        // Then
        assertThat(schoolMember.getFirstName()).isEqualTo(updateRequest.firstName());
        assertThat(schoolMember.getLastName()).isNotEqualTo(updateRequest.lastName());
    }

    @Test
    @DisplayName("Should update only last name of school member")
    void shouldUpdateOnlyLastNameOfSchoolMember() {
        // Given
        SchoolMemberUpdateRequest updateRequest = new SchoolMemberUpdateRequest(null, "Smith");
        when(schoolMemberRepository.findById(userId)).thenReturn(Optional.of(schoolMember));
        when(mapper.mapEntityToResponse(schoolMember)).thenReturn(response);

        // When
        schoolMemberService.updateSchoolMember(userId, updateRequest);

        // Then
        assertThat(schoolMember.getFirstName()).isNotEqualTo(updateRequest.firstName());
        assertThat(schoolMember.getLastName()).isEqualTo(updateRequest.lastName());
    }

    @Test
    @DisplayName("Should delete school member by ID")
    void shouldDeleteSchoolMemberById() {
        // Given
        when(schoolMemberRepository.findById(userId)).thenReturn(Optional.of(schoolMember));

        // When
        schoolMemberService.deleteSchoolMember(userId);

        // Then
        verify(schoolMemberRepository).delete(schoolMember);
    }
}
