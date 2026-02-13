package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.ApiResponse;
import pl.edu.ug.schoolgradebook.dto.schoolmember.SchoolMemberCreateRequest;
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
    public ResponseEntity<ApiResponse<SchoolMemberResponse>> create(@RequestBody SchoolMemberCreateRequest request) {
        SchoolMemberResponse member = service.create(request);
        URI location = URI.create(ApiPaths.SCHOOL_MEMBERS + "/" + member.userId());

        return ResponseEntity
                .created(location)
                .body(ApiResponse.created("School member created successfully", member));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SchoolMemberResponse>>> getAll(@RequestParam(required = false) UUID schoolId, @RequestParam(required = false) UserRole role) {
        List<SchoolMemberResponse> members;
        String message;
        if (schoolId != null) {
            if (role != null) {
                members = service.getBySchoolIdAndUserRole(schoolId, role);
                message = "All " + role + " from school with ID " + schoolId + " fetched successfully";
            } else {
                members = service.getBySchoolId(schoolId);
                message = "All members from school with ID " + schoolId + " fetched successfully";
            }
        } else {
            members = service.getAll();
            message = "All school members fetched successfully";
        }

        return ResponseEntity.ok(ApiResponse.ok(message, members));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SchoolMemberResponse>> getById(@PathVariable UUID id) {
        SchoolMemberResponse member = service.getById(id);
        return ResponseEntity.ok(ApiResponse.ok("School member fetched successfully", member));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<SchoolMemberResponse>> update(@PathVariable UUID id, @RequestBody SchoolMemberUpdateRequest request) {
        SchoolMemberResponse member = service.update(id, request);
        return ResponseEntity.ok(ApiResponse.ok("School member updated successfully", member));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
