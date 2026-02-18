package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.ApiResponse;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberRequest;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberResponse;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberUpdateRequest;
import pl.edu.ug.schoolgradebook.enums.UserRole;
import pl.edu.ug.schoolgradebook.service.SchoolMemberService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(ApiPaths.SCHOOL_MEMBERS)
@RequiredArgsConstructor
public class SchoolMemberController {
    private final SchoolMemberService service;

    @PostMapping
    public ResponseEntity<ApiResponse<SchoolMemberResponse>> createSchoolMember(@RequestBody SchoolMemberRequest request) {
        SchoolMemberResponse member = service.createSchoolMember(request);
        URI location = URI.create(ApiPaths.SCHOOL_MEMBERS + "/" + member.userId());
        return ResponseEntity
                .created(location)
                .body(ApiResponse.created("School member created successfully", member));
    }

    @GetMapping("/{schoolMemberId}")
    public ResponseEntity<ApiResponse<SchoolMemberResponse>> getSchoolMemberById(@PathVariable UUID schoolMemberId) {
        SchoolMemberResponse member = service.getSchoolMemberById(schoolMemberId);
        return ResponseEntity.ok(ApiResponse.ok("School member retrieved successfully", member));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SchoolMemberResponse>>> getAllSchoolMembers(
            @RequestParam(required = false) UUID schoolId,
            @RequestParam(required = false) UserRole role
    ) {
        List<SchoolMemberResponse> members;
        String message;
        if (schoolId != null) {
            if (role != null) {
                members = service.getAllSchoolMembersBySchoolIdAndUserRole(schoolId, role);
                String roleName = role.toString().toLowerCase().replace("_", " ") + "s";
                message = "All " + roleName + " from school with ID " + schoolId + " retrieved successfully";
            } else {
                members = service.getAllSchoolMembersBySchoolId(schoolId);
                message = "All members from school with ID " + schoolId + " retrieved successfully";
            }
        } else {
            members = service.getAllSchoolMembers();
            message = "All school members retrieved successfully";
        }

        return ResponseEntity.ok(ApiResponse.ok(message, members));
    }

    @PatchMapping("/{schoolMemberId}")
    public ResponseEntity<ApiResponse<SchoolMemberResponse>> updateSchoolMember(
            @PathVariable UUID schoolMemberId,
            @RequestBody SchoolMemberUpdateRequest request
    ) {
        SchoolMemberResponse member = service.updateSchoolMember(schoolMemberId, request);
        return ResponseEntity.ok(ApiResponse.ok("School member updated successfully", member));
    }

    @DeleteMapping("/{schoolMemberId}")
    public ResponseEntity<Void> deleteSchoolMember(@PathVariable UUID schoolMemberId) {
        service.deleteSchoolMember(schoolMemberId);
        return ResponseEntity.noContent().build();
    }
}
