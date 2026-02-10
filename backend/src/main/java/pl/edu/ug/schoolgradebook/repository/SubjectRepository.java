package pl.edu.ug.schoolgradebook.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.ug.schoolgradebook.domain.Subject;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, UUID> {
    List<Subject> findBySchoolId(UUID schoolId);
    boolean existsBySchoolIdAndNameIgnoreCase(UUID schoolId, String name);
}
