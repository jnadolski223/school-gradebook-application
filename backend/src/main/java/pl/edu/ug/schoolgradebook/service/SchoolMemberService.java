package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.domain.User;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberCreateRequest;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberResponse;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberUpdateRequest;
import pl.edu.ug.schoolgradebook.exception.ConflictException;
import pl.edu.ug.schoolgradebook.exception.EntityNotFoundException;
import pl.edu.ug.schoolgradebook.repository.SchoolMemberRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolRepository;
import pl.edu.ug.schoolgradebook.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SchoolMemberService {

    private final SchoolMemberRepository schoolMemberRepository;
    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;

    public SchoolMemberResponse create(SchoolMemberCreateRequest request) {
        User user = userRepository
                .findById(request.userId())
                .orElseThrow(() -> new EntityNotFoundException(User.class, request.userId().toString()));

        School school = schoolRepository
                .findById(request.schoolId())
                .orElseThrow(() -> new EntityNotFoundException(School.class, request.userId().toString()));

        if (schoolMemberRepository.existsById(user.getId())) {
            throw new ConflictException("User is already a school member");
        }

        SchoolMember member = SchoolMember.builder()
                .user(user)
                .school(school)
                .firstName(request.firstName())
                .lastName(request.lastName())
                .build();

        schoolMemberRepository.save(member);
        return mapToDto(member);
    }

    @Transactional(readOnly = true)
    public List<SchoolMemberResponse> getAll() {
        return schoolMemberRepository.findAll().stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<SchoolMemberResponse> getBySchoolId(UUID schoolId) {
        return schoolMemberRepository.findBySchool_Id(schoolId).stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public SchoolMemberResponse getById(UUID userId) {
        return schoolMemberRepository
                .findById(userId)
                .map(this::mapToDto)
                .orElseThrow(() -> new EntityNotFoundException(SchoolMember.class, userId.toString()));
    }

    public  SchoolMemberResponse update(UUID userId, SchoolMemberUpdateRequest request) {
        SchoolMember member = schoolMemberRepository
                .findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(SchoolMember.class, userId.toString()));

        if (request.firstName() != null) {
            member.setFirstName(request.firstName());
        }

        if (request.lastName() != null) {
            member.setLastName(request.lastName());
        }

        schoolMemberRepository.save(member);
        return mapToDto(member);
    }

    public void delete(UUID userId) {
        if (!schoolMemberRepository.existsById(userId)) {
            throw new EntityNotFoundException(SchoolMember.class, userId.toString());
        }
        schoolMemberRepository.deleteById(userId);
    }

    private SchoolMemberResponse mapToDto(SchoolMember member) {
        return new SchoolMemberResponse(
                member.getUser().getId(),
                member.getSchool().getId(),
                member.getFirstName(),
                member.getLastName()
        );
    }
}
