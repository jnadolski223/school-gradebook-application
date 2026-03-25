package pl.edu.ug.schoolgradebook.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.ug.schoolgradebook.domain.Attendance;
import pl.edu.ug.schoolgradebook.domain.LessonTime;
import pl.edu.ug.schoolgradebook.domain.SchoolMember;
import pl.edu.ug.schoolgradebook.domain.Student;
import pl.edu.ug.schoolgradebook.dto.attendance.AttendanceRequest;
import pl.edu.ug.schoolgradebook.dto.attendance.AttendanceResponse;
import pl.edu.ug.schoolgradebook.dto.attendance.AttendanceUpdateRequest;
import pl.edu.ug.schoolgradebook.exception.ConflictException;
import pl.edu.ug.schoolgradebook.repository.AttendanceRepository;
import pl.edu.ug.schoolgradebook.repository.LessonTimeRepository;
import pl.edu.ug.schoolgradebook.repository.SchoolMemberRepository;
import pl.edu.ug.schoolgradebook.repository.StudentRepository;
import pl.edu.ug.schoolgradebook.util.mapper.AttendanceMapper;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceService extends EntityService {
    private final AttendanceRepository attendanceRepository;
    private final SchoolMemberRepository schoolMemberRepository;
    private final StudentRepository studentRepository;
    private final LessonTimeRepository lessonTimeRepository;
    private final AttendanceMapper mapper;

    @Transactional
    public AttendanceResponse createAttendance(AttendanceRequest request) {
        SchoolMember teacher = getOrThrow(schoolMemberRepository, SchoolMember.class, request.teacherId());
        Student student = getOrThrow(studentRepository, Student.class, request.studentId());
        LessonTime lessonTime = getOrThrow(lessonTimeRepository, LessonTime.class, request.lessonTimeId());

        if (attendanceRepository.findByStudentAndLessonTimeAndLessonDate(student, lessonTime, request.lessonDate()).isPresent()) {
            throw new ConflictException("Attendance is already created for this student on this lesson time and lesson date");
        }

        Attendance attendance = mapper.mapRequestToEntity(request, teacher, student, lessonTime);
        return mapper.mapEntityToResponse(attendanceRepository.save(attendance));
    }

    public AttendanceResponse getAttendanceById(UUID attendanceId) {
        Attendance attendance = getOrThrow(attendanceRepository, Attendance.class, attendanceId);
        return mapper.mapEntityToResponse(attendance);
    }

    public List<AttendanceResponse> getAllAttendances() {
        return attendanceRepository
                .findAll()
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    public List<AttendanceResponse> getAllAttendancesByStudentId(UUID studentId) {
        return attendanceRepository
                .findByStudent_SchoolMemberId(studentId)
                .stream()
                .map(mapper::mapEntityToResponse)
                .toList();
    }

    @Transactional
    public AttendanceResponse updateAttendance(UUID attendanceId, AttendanceUpdateRequest request) {
        Attendance attendance = getOrThrow(attendanceRepository, Attendance.class, attendanceId);
        SchoolMember teacher = getOrThrow(schoolMemberRepository, SchoolMember.class, request.teacherId());

        attendance.setTeacher(teacher);
        attendance.setAttendanceStatus(request.attendanceStatus());

        return mapper.mapEntityToResponse(attendance);
    }

    @Transactional
    public void deleteAttendance(UUID attendanceId) {
        Attendance attendance = getOrThrow(attendanceRepository, Attendance.class, attendanceId);
        attendanceRepository.delete(attendance);
    }
}
