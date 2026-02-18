package pl.edu.ug.schoolgradebook.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.edu.ug.schoolgradebook.domain.LessonTime;
import pl.edu.ug.schoolgradebook.domain.School;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface LessonTimeRepository extends JpaRepository<LessonTime, UUID> {
    List<LessonTime> findBySchool_Id(UUID schoolId);

    @Query("""
        SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END
        FROM LessonTime l
        WHERE l.school = :school
        AND l.lessonStart < :lessonEnd
        AND l.lessonEnd > :lessonStart
    """)
    boolean existsOverlappingLessonTime(
            School school,
            LocalTime lessonStart,
            LocalTime lessonEnd
    );

    @Query("""
        SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END
        FROM LessonTime l
        WHERE l.school = :school
        AND l.id <> :lessonTimeId
        AND l.lessonStart < :lessonEnd
        AND l.lessonEnd > :lessonStart
    """)
    boolean existsOverlappingLessonTimeForUpdate(
            School school,
            UUID lessonTimeId,
            LocalTime lessonStart,
            LocalTime lessonEnd
    );
}
