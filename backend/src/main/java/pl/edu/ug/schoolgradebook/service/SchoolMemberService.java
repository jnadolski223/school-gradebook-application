package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SchoolMemberService extends EntityService {
    private final SchoolMemberRepository schoolMemberRepository;
    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final UserService userService;
    private final SchoolMemberMapper mapper;

    @Transactional
    public SchoolMemberResponse createSchoolMember(SchoolMemberRequest request) {
        UserRequest userRequest = new UserRequest(
                request.login(),
                request.password(),
                request.role()
        );
        UserResponse createdUser = userService.registerUser(userRequest);
        User user = getOrThrow(userRepository, User.class, createdUser.id());
        School school = getOrThrow(schoolRepository, School.class, request.schoolId());

        if (schoolMemberRepository.existsById(user.getId())) {
            throw new ConflictException("User is already a school member");
        }

        SchoolMember member = mapper.mapRequestToEntity(request, user, school);
        return mapper.mapEntityToResponse(schoolMemberRepository.save(member));
    }

    public SchoolMemberResponse getSchoolMemberById(UUID schoolMemberId) {
        SchoolMember member = getOrThrow(schoolMemberRepository, SchoolMember.class, schoolMemberId);
        return mapper.mapEntityToResponse(member);
    }

    public List<SchoolMemberResponse> getAllSchoolMembers() {
        return schoolMemberRepository
                .findAll()
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    public List<SchoolMemberResponse> getAllSchoolMembersBySchoolId(UUID schoolId) {
        return schoolMemberRepository
                .findBySchool_Id(schoolId)
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    public List<SchoolMemberResponse> getAllSchoolMembersBySchoolIdAndUserRole(UUID schoolId, UserRole role) {
        return schoolMemberRepository
                .findBySchool_IdAndUser_Role(schoolId, role)
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    @Transactional
    public  SchoolMemberResponse updateSchoolMember(UUID schoolMemberId, SchoolMemberUpdateRequest request) {
        SchoolMember member = getOrThrow(schoolMemberRepository, SchoolMember.class, schoolMemberId);

        if (request.firstName() != null) {
            member.setFirstName(request.firstName());
        }

        if (request.lastName() != null) {
            member.setLastName(request.lastName());
        }

        return mapper.mapEntityToResponse(member);
    }

    @Transactional
    public void deleteSchoolMember(UUID schoolMemberId) {
        SchoolMember member = getOrThrow(schoolMemberRepository, SchoolMember.class, schoolMemberId);
        schoolMemberRepository.delete(member);
    }
}
