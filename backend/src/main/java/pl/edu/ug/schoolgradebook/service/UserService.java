package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService extends EntityService {
    private final UserRepository userRepository;
    private final SchoolMemberRepository schoolMemberRepository;
    private final UserMapper mapper;

    @Transactional
    public UserResponse registerUser(UserRequest request) {
        if (userRepository.existsByLogin(request.login())) {
            throw new ConflictException("Login is taken by another user");
        }
        User user = mapper.mapRequestToEntity(request);
        return mapper.mapEntityToResponse(userRepository.save(user));
    }

    public UserLoginResponse loginUser(UserLoginRequest request) {
        User user = userRepository
                .findByLogin(request.login())
                .orElseThrow(this::unauthorized);
        if (!user.getPassword().equals(request.password())) {
            throw unauthorized();
        }
        UUID schoolId = resolveSchoolId(user);
        return mapper.mapEntityToLoginResponse(user, schoolId);
    }

    public UserResponse getUserById(UUID userId) {
        User user = getOrThrow(userRepository, User.class, userId);
        return mapper.mapEntityToResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository
                .findAll()
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    @Transactional
    public UserResponse updateUser(UUID userId, UserRequest request) {
        User user = getOrThrow(userRepository, User.class, userId);
        updateLogin(user, request.login());
        updatePassword(user, request.password());
        updateRole(user, request.role());
        return mapper.mapEntityToResponse(user);
    }

    @Transactional
    public void activateUser(UUID userId) {
        User user = getOrThrow(userRepository, User.class, userId);
        user.setActive(true);
    }

    @Transactional
    public void deactivateUser(UUID userId) {
        User user = getOrThrow(userRepository, User.class, userId);
        user.setActive(false);
    }

    @Transactional
    public void deleteUser(UUID userId) {
        User user = getOrThrow(userRepository, User.class, userId);
        userRepository.delete(user);
    }

    private UnauthorizedException unauthorized() {
        return new UnauthorizedException("Invalid credentials");
    }

    private UUID resolveSchoolId(User user) {
        if (user.getRole() == UserRole.APP_ADMINISTRATOR) {
            return null;
        }
        SchoolMember schoolMember = getOrThrow(schoolMemberRepository, SchoolMember.class, user.getId());
        return schoolMember.getSchool().getId();
    }

    private void updateLogin(User user, String login) {
        if (login == null || login.equals(user.getLogin())) {
            return;
        }
        boolean loginTaken = userRepository.existsByLogin(login);
        if (loginTaken) {
            throw new ConflictException("Login is taken by another user");
        }
        user.setLogin(login);
    }

    private void updatePassword(User user, String password) {
        if(password != null) {
            user.setPassword(password);
        }
    }

    private void updateRole(User user, UserRole role) {
        if (role != null) {
            user.setRole(role);
        }
    }
}
