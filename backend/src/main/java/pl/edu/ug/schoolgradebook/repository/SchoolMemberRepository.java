package pl.edu.ug.schoolgradebook.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;

import java.util.List;
import java.util.UUID;

@Repository
public interface SchoolMemberRepository extends JpaRepository<SchoolMember, UUID> {
    List<SchoolMember> findBySchool_Id(UUID schoolId);
}
