package pl.edu.ug.schoolgradebook.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.ug.schoolgradebook.domain.LessonTime;
import pl.edu.ug.schoolgradebook.domain.School;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface LessonTimeRepository extends JpaRepository<LessonTime, UUID> {
    List<LessonTime> findBySchool_Id(UUID schoolId);

    boolean existsBySchoolAndLessonStart(School school, LocalTime lessonStart);

    boolean existsBySchoolAndLessonEnd(School school, LocalTime lessonEnd);

}
