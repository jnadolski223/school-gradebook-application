package pl.edu.ug.schoolgradebook.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.ug.schoolgradebook.api.ApiPaths;
import pl.edu.ug.schoolgradebook.dto.SchoolApplicationRequest;
import pl.edu.ug.schoolgradebook.dto.SchoolApplicationResponseFull;
import pl.edu.ug.schoolgradebook.dto.SchoolApplicationResponseShort;
import pl.edu.ug.schoolgradebook.enums.SchoolApplicationStatus;
import pl.edu.ug.schoolgradebook.service.SchoolApplicationService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.SCHOOL_APPLICATIONS)
@RequiredArgsConstructor
public class SchoolApplicationController {
    private final SchoolApplicationService schoolApplicationService;

    @PostMapping
    public ResponseEntity<SchoolApplicationResponseFull> createApplication(@RequestBody SchoolApplicationRequest requestDto) {
        return new ResponseEntity<>(schoolApplicationService.createApplication(requestDto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SchoolApplicationResponseShort>> getApplications(@RequestParam(required = false)SchoolApplicationStatus status) {
        List<SchoolApplicationResponseShort> applications = (status != null) ?
                schoolApplicationService.getApplicationsByStatusShort(status) :
                schoolApplicationService.getAllApplicationsShort();

        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchoolApplicationResponseFull> getApplicationById(@PathVariable UUID id) {
        return ResponseEntity.ok(schoolApplicationService.getApplicationById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SchoolApplicationResponseFull> updateApplicationStatus(@PathVariable UUID id, @RequestParam SchoolApplicationStatus status) {
        return ResponseEntity.ok(schoolApplicationService.updateApplicationStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable UUID id) {
        schoolApplicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }
}
