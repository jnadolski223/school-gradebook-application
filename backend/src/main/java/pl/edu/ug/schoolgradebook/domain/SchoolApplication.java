package pl.edu.ug.schoolgradebook.domain;

import jakarta.persistence.*;
import lombok.*;
import pl.edu.ug.schoolgradebook.enums.SchoolApplicationStatus;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "school_applications")
@Getter
@Setter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class SchoolApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    private String senderFirstName;
    private String senderLastName;
    private String senderEmail;
    private String schoolName;
    private String schoolStreet;
    private String schoolPostalCode;
    private String schoolCity;
    private String rspoNumber;

    @Lob
    private String description;

    @Column(updatable = false)
    private Instant createdAt;

    @Enumerated(EnumType.STRING)
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
