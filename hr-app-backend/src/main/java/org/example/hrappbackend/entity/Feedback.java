package org.example.hrappbackend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
public class Feedback {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "from_employee_id")
    private Employee fromEmployee;

    @ManyToOne(optional = false)
    @JoinColumn(name = "to_employee_id")
    private Employee toEmployee;

    @Column(nullable = false, length = 1000)
    private String feedbackText;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}