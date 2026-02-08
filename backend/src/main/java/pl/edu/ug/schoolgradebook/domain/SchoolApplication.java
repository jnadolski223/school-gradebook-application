package pl.edu.ug.schoolgradebook.domain;

import jakarta.persistence.*;
import lombok.*;
import pl.edu.ug.schoolgradebook.enums.SchoolApplicationStatus;

import java.time.LocalDateTime;
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

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SchoolApplicationStatus status;
}
