package pl.edu.ug.schoolgradebook.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.ug.schoolgradebook.domain.SchoolApplication;
import pl.edu.ug.schoolgradebook.enums.SchoolApplicationStatus;

import java.util.List;
import java.util.UUID;

@Repository
public interface SchoolApplicationRepository extends JpaRepository<SchoolApplication, UUID> {
    List<SchoolApplication> findByStatus(SchoolApplicationStatus status);
}
