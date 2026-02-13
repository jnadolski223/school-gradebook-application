package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.domain.User;
import pl.edu.ug.schoolgradebook.dto.user.*;
import pl.edu.ug.schoolgradebook.enums.UserRole;
import pl.edu.ug.schoolgradebook.exception.ConflictException;
import pl.edu.ug.schoolgradebook.exception.EntityNotFoundException;
import pl.edu.ug.schoolgradebook.repository.SchoolMemberRepository;
import pl.edu.ug.schoolgradebook.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final SchoolMemberRepository schoolMemberRepository;

    public UserResponse register(UserRegisterRequest request) {
        if (userRepository.existsByLogin(request.login())) {
            throw new ConflictException("Login is taken by another user");
        }

        User user = User.builder()
                .login(request.login())
                .password(request.password())
                .role(request.role())
                .isActive(true)
                .build();

        userRepository.save(user);
        return mapToDto(user);
    }

    public UserLoginResponse login(UserLoginRequest request) {
        User user = userRepository
                .findByLogin(request.login())
                .orElseThrow(() -> new IllegalArgumentException("Invalid login or password"));

        if (!user.isActive()) {
            throw new IllegalArgumentException("User is inactive");
        }

        if (!user.getPassword().equals(request.password())) {
            throw new IllegalArgumentException("Invalid login or password");
        }

        if (user.getRole() != UserRole.APP_ADMINISTRATOR) {
            SchoolMember schoolMember = schoolMemberRepository
                    .findById(user.getId())
                    .orElseThrow(() -> new EntityNotFoundException(SchoolMember.class, user.getId().toString()));

            return new UserLoginResponse(
                    user.getId(),
                    user.getLogin(),
                    user.getRole(),
                    schoolMember.getSchool().getId(),
                    user.isActive()
            );
        }


        return new UserLoginResponse(
                user.getId(),
                user.getLogin(),
                user.getRole(),
                null,
                user.isActive()
        );
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsers(Boolean active) {
        List<User> users = active == null
                ? userRepository.findAll()
                : userRepository.findByIsActive(active);

        return users.stream().map(this::mapToDto).toList();
    }

    public UserResponse updateUser(UUID id, UserUpdateRequest request) {
        User user = userRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(User.class, id.toString()));

        if (request.login() != null && !request.login().equals(user.getLogin())) {
            if (userRepository.existsByLogin(request.login())) {
                throw new ConflictException("Login is taken by another user");
            }
            user.setLogin(request.login());
        }

        if (request.password() != null) {
            user.setPassword(request.password());
        }

        if (request.role() != null) {
            user.setRole(request.role());
        }

        userRepository.save(user);
        return mapToDto(user);
    }

    public void activate(UUID id) {
        setActive(id, true);
    }

    public void deactivate(UUID id) {
        setActive(id, false);
    }

    public void delete(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException(User.class, id.toString());
        }
        userRepository.deleteById(id);
    }

    private void setActive(UUID id, boolean active) {
        User user = userRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(User.class, id.toString()));
        user.setActive(active);
    }

    private UserResponse mapToDto(User user) {
        return new UserResponse(
                user.getId(),
                user.getLogin(),
                user.getRole(),
                user.getCreatedAt(),
                user.getModifiedAt(),
                user.isActive()
        );
    }
}
