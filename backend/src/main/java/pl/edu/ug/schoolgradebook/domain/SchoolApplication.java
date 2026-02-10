package pl.edu.ug.schoolgradebook.domain;

import jakarta.persistence.*;
import lombok.*;
import pl.edu.ug.schoolgradebook.enums.SchoolApplicationStatus;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "school_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false)
    private String senderFirstName;

    @Column(nullable = false)
    private String senderLastName;

    @Column(nullable = false)
    private String senderEmail;

    @Column(nullable = false)
    private String schoolName;

    @Column(nullable = false)
    private String schoolStreet;

    @Column(nullable = false)
    private String schoolPostalCode;

    @Column(nullable = false)
    private String schoolCity;

    @Column(nullable = false)
    private String rspoNumber;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SchoolApplicationStatus status = SchoolApplicationStatus.PENDING;

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
        if (this.status == null) {
            this.status = SchoolApplicationStatus.PENDING;
        }
    }
}
