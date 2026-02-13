package pl.edu.ug.schoolgradebook.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.enums.UserRole;

import java.util.List;
import java.util.UUID;

@Repository
public interface SchoolMemberRepository extends JpaRepository<SchoolMember, UUID> {
    List<SchoolMember> findBySchool_Id(UUID schoolId);

    List<SchoolMember> findBySchool_IdAndUser_Role(UUID schoolId, UserRole role);

    boolean existsBySchool_IdAndUser_Role(UUID schoolId, UserRole role);
}
