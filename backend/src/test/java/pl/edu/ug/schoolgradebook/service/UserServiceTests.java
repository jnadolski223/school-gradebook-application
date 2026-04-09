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
import pl.edu.ug.schoolgradebook.dto.user.UserLoginRequest;
import pl.edu.ug.schoolgradebook.dto.user.UserLoginResponse;
import pl.edu.ug.schoolgradebook.dto.user.UserRequest;
import pl.edu.ug.schoolgradebook.dto.user.UserResponse;
import pl.edu.ug.schoolgradebook.enums.UserRole;
import pl.edu.ug.schoolgradebook.exception.ConflictException;
import pl.edu.ug.schoolgradebook.exception.UnauthorizedException;
import pl.edu.ug.schoolgradebook.repository.SchoolMemberRepository;
import pl.edu.ug.schoolgradebook.repository.UserRepository;
import pl.edu.ug.schoolgradebook.util.mapper.UserMapper;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {

    @Mock
    private UserRepository repository;

    @Mock
    private SchoolMemberRepository schoolMemberRepository;

    @Mock
    private UserMapper mapper;

    @InjectMocks
    private UserService service;

    private UUID id;
    private UserRequest request;
    private User user;
    private UserResponse response;

    @BeforeEach
    void setUp() {
        id = UUID.randomUUID();

        request = new UserRequest(
                "john-doe-123",
                "test123",
                UserRole.TEACHER
        );

        user = User.builder()
                .id(id)
                .login(request.login())
                .password(request.password())
                .role(request.role())
                .createdAt(Instant.now())
                .modifiedAt(Instant.now())
                .active(true)
                .build();

        response = new UserResponse(
                user.getId(),
                user.getLogin(),
                user.getRole(),
                user.getCreatedAt(),
                user.getModifiedAt(),
                user.isActive()
        );
    }

    @Test
    @DisplayName("Should register new user")
    void shouldRegisterUser() {
        // Given
        when(repository.existsByLogin(request.login())).thenReturn(false);
        when(mapper.mapRequestToEntity(request)).thenReturn(user);
        when(repository.save(user)).thenReturn(user);
        when(mapper.mapEntityToResponse(user)).thenReturn(response);

        // When
        UserResponse result = service.registerUser(request);

        // Then
        assertThat(result).isEqualTo(response);
        verify(repository).save(user);
    }

    @Test
    @DisplayName("Should not register new user due to login conflict")
    void shouldNotRegisterUser() {
        // Given
        when(repository.existsByLogin(request.login())).thenReturn(true);

        // When & Then
        assertThrows(ConflictException.class, () -> service.registerUser(request));
    }

    @Test
    @DisplayName("Should log in user")
    void shouldLogInUser() {
        // Given
        UUID schoolId = UUID.randomUUID();
        UserLoginRequest loginRequest = new UserLoginRequest("john-doe-123", "test123");
        UserLoginResponse loginResponse = new UserLoginResponse(
                user.getId(),
                user.getLogin(),
                user.getRole(),
                schoolId,
                user.isActive()
        );
        SchoolMember member = SchoolMember.builder()
                .school(School.builder().id(schoolId).build())
                .build();

        when(repository.findByLogin(loginRequest.login())).thenReturn(Optional.of(user));
        when(schoolMemberRepository.findById(id)).thenReturn(Optional.of(member));
        when(mapper.mapEntityToLoginResponse(user, schoolId)).thenReturn(loginResponse);

        // When
        UserLoginResponse result = service.loginUser(loginRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEqualTo(loginResponse);
    }

    @Test
    @DisplayName("Should log in as app administrator")
    void shouldLogInAsAppAdministrator() {
        // Given
        UserLoginRequest loginRequest = new UserLoginRequest("admin", "admin");
        User admin = User.builder()
                .id(id)
                .login("admin")
                .password("admin")
                .role(UserRole.APP_ADMINISTRATOR)
                .createdAt(Instant.now())
                .modifiedAt(Instant.now())
                .active(true)
                .build();
        UserLoginResponse loginResponse = new UserLoginResponse(
                admin.getId(),
                admin.getLogin(),
                admin.getRole(),
                null,
                admin.isActive()
        );

        when(repository.findByLogin(loginRequest.login())).thenReturn(Optional.of(admin));
        when(mapper.mapEntityToLoginResponse(admin, null)).thenReturn(loginResponse);

        // When
        UserLoginResponse result = service.loginUser(loginRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEqualTo(loginResponse);
    }

    @Test
    @DisplayName("Should throw UnauthorizedException if password is invalid")
    void shouldThrowExceptionIfPasswordIsInvalid() {
        // Given
        UserLoginRequest loginRequest = new UserLoginRequest("john-doe-123", "test");
        when(repository.findByLogin(loginRequest.login())).thenReturn(Optional.of(user));

        // When & Then
        assertThrows(UnauthorizedException.class, () -> service.loginUser(loginRequest));
    }

    @Test
    @DisplayName("Should return user by ID")
    void shouldReturnUserById() {
        // Given
        when(repository.findById(id)).thenReturn(Optional.of(user));
        when(mapper.mapEntityToResponse(user)).thenReturn(response);

        // When
        UserResponse result = service.getUserById(id);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(id);
        verify(repository).findById(id);
    }

    @Test
    @DisplayName("Should return list of users")
    void shouldReturnListOfUsers() {
        // Given
        List<User> users = List.of(user, user);
        when(repository.findAll()).thenReturn(users);
        when(mapper.mapEntityToResponse(any())).thenReturn(response);

        // When
        List<UserResponse> results = service.getAllUsers();

        // Then
        assertThat(results).hasSize(2);
        verify(repository).findAll();
    }

    @Test
    @DisplayName("Should update user data")
    void shouldUpdateUser() {
        // Given
        UserRequest newRequest = new UserRequest(
                "john-smith-123",
                "john_smith_test_123",
                UserRole.PARENT
        );

        UserResponse updatedUser = new UserResponse(
                id,
                newRequest.login(),
                newRequest.role(),
                user.getCreatedAt(),
                user.getModifiedAt(),
                user.isActive()
        );

        when(repository.findById(id)).thenReturn(Optional.of(user));
        when(mapper.mapEntityToResponse(user)).thenReturn(updatedUser);

        // When
        UserResponse result = service.updateUser(id, newRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.login()).isEqualTo(newRequest.login());
        assertThat(user.getPassword()).isEqualTo(newRequest.password());
        assertThat(result.role()).isEqualTo(newRequest.role());
    }

    @Test
    @DisplayName("Should update only login and password")
    void shouldUpdateUserLoginAndPassword() {
        // Given
        UserRequest newRequest = new UserRequest(
                "john-smith-123",
                "john_smith_test_123",
                null
        );

        UserResponse updatedUser = new UserResponse(
                id,
                newRequest.login(),
                user.getRole(),
                user.getCreatedAt(),
                user.getModifiedAt(),
                user.isActive()
        );
        when(repository.findById(id)).thenReturn(Optional.of(user));
        when(mapper.mapEntityToResponse(user)).thenReturn(updatedUser);

        // When
        UserResponse result = service.updateUser(id, newRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.login()).isEqualTo(newRequest.login());
        assertThat(user.getPassword()).isEqualTo(newRequest.password());
        assertThat(result.role()).isEqualTo(request.role());
    }

    @Test
    @DisplayName("Should update only login")
    void shouldUpdateUserLogin() {
        // Given
        UserRequest newRequest = new UserRequest(
                "john-smith-123",
                null,
                null
        );

        UserResponse updatedUser = new UserResponse(
                id,
                newRequest.login(),
                user.getRole(),
                user.getCreatedAt(),
                user.getModifiedAt(),
                user.isActive()
        );
        when(repository.findById(id)).thenReturn(Optional.of(user));
        when(mapper.mapEntityToResponse(user)).thenReturn(updatedUser);

        // When
        UserResponse result = service.updateUser(id, newRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.login()).isEqualTo(newRequest.login());
        assertThat(user.getPassword()).isEqualTo(request.password());
        assertThat(result.role()).isEqualTo(request.role());
    }

    @Test
    @DisplayName("Should throw ConflictException when login already exists")
    void shouldThrowExceptionIfLoginAlreadyExists() {
        // Given
        UserRequest newRequest = new UserRequest(
                "john-smith-123",
                "john_smith_test_123",
                UserRole.PARENT
        );
        when(repository.findById(id)).thenReturn(Optional.of(user));
        when(repository.existsByLogin(newRequest.login())).thenReturn(true);

        // When & Then
        assertThrows(ConflictException.class, () -> service.updateUser(id, newRequest));
    }

    @Test
    @DisplayName("Should not change login when it is the same")
    void shouldNotUpdateLogin() {
        // Given
        UserRequest newRequest = new UserRequest(
                "john-doe-123",
                null,
                null
        );

        UserResponse updatedUser = new UserResponse(
                id,
                newRequest.login(),
                user.getRole(),
                user.getCreatedAt(),
                user.getModifiedAt(),
                user.isActive()
        );
        when(repository.findById(id)).thenReturn(Optional.of(user));
        when(mapper.mapEntityToResponse(user)).thenReturn(updatedUser);

        // When
        UserResponse result = service.updateUser(id, newRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.login()).isEqualTo(request.login());
        assertThat(user.getPassword()).isEqualTo(request.password());
        assertThat(result.role()).isEqualTo(request.role());
    }

    @Test
    @DisplayName("Should change use active to true")
    void shouldActivateUser() {
        // Given
        when(repository.findById(id)).thenReturn(Optional.of(user));

        // When
        service.activateUser(id);

        // Then
        assertThat(user.isActive()).isTrue();
    }

    @Test
    @DisplayName("Should change use active to false")
    void shouldDeactivateUser() {
        // Given
        when(repository.findById(id)).thenReturn(Optional.of(user));

        // When
        service.deactivateUser(id);

        // Then
        assertThat(user.isActive()).isFalse();
    }

    @Test
    @DisplayName("Should delete user by ID")
    void shouldDeleteUserById() {
        // Given
        when(repository.findById(id)).thenReturn(Optional.of(user));

        // When
        service.deleteUser(id);

        // Then
        verify(repository).delete(user);
    }
}
