package pl.edu.ug.schoolgradebook.util.mapper;

import org.springframework.stereotype.Component;
import pl.edu.ug.schoolgradebook.domain.School;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.domain.User;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberRequest;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberResponse;

@Component
public class SchoolMemberMapper {
    public SchoolMember mapRequestToEntity(SchoolMemberRequest request, User user, School school) {
        return SchoolMember.builder()
                .user(user)
                .school(school)
                .firstName(request.firstName())
                .lastName(request.lastName())
                .build();
    }

    public SchoolMemberResponse mapEntityToResponse(SchoolMember member) {
        return new SchoolMemberResponse(
                member.getUser().getId(),
                member.getSchool().getId(),
                member.getUser().getLogin(),
                member.getFirstName(),
                member.getLastName(),
                member.getUser().getRole()
        );
    }
}
