package pl.edu.ug.schoolgradebook.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.ug.schoolgradebook.domain.School;

import java.util.List;
import java.util.UUID;

public interface SchoolRepository extends JpaRepository<School, UUID> {
    List<School> findByIsActive(boolean isActive);
}
