package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.ApiResponse;
import pl.edu.ug.schoolgradebook.dto.school.SchoolRequest;
import pl.edu.ug.schoolgradebook.dto.school.SchoolResponseFull;
import pl.edu.ug.schoolgradebook.dto.school.SchoolResponseShort;
import pl.edu.ug.schoolgradebook.service.SchoolService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(ApiPaths.SCHOOLS)
@RequiredArgsConstructor
public class SchoolController {

    private final SchoolService service;

    @PostMapping
    public ResponseEntity<ApiResponse<SchoolResponseFull>> create(@RequestBody SchoolRequest request) {
        SchoolResponseFull school = service.create(request);
        URI location = URI.create(ApiPaths.SCHOOLS + "/" + school.id());

        return ResponseEntity
                .created(location)
                .body(ApiResponse.created("School created successfully", school));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SchoolResponseShort>>> getAll(@RequestParam(required = false) Boolean active) {
        List<SchoolResponseShort> schools = service.getAll(active);
        String message;
        if (active == null) {
            message = "All schools fetched successfully";
        } else if (active) {
            message = "All active schools fetched successfully";
        } else {
            message = "All inactive schools fetched successfully";
        }

        return ResponseEntity.ok(ApiResponse.ok(message, schools));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SchoolResponseFull>> getById(@PathVariable UUID id) {
        SchoolResponseFull school = service.getById(id);
        return ResponseEntity.ok(ApiResponse.ok("School fetched successfully", school));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SchoolResponseFull>> update(@PathVariable UUID id, @RequestBody SchoolRequest request) {
        SchoolResponseFull school = service.update(id, request);
        return ResponseEntity.ok(ApiResponse.ok("School updated successfully", school));
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> activate(@PathVariable UUID id) {
        service.activate(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivate(@PathVariable UUID id) {
        service.deactivate(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
