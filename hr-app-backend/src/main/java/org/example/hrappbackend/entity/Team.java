package org.example.hrappbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.example.hrappbackend.dto.TeamDTO;

import java.util.Set;
import java.util.UUID;

@Entity
@Data
public class Team {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Employee manager;

    @ManyToMany
    @JoinTable(
            name = "team_employees",
            joinColumns = @JoinColumn(name = "team_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    private Set<Employee> employees;


    public TeamDTO toDTO() {
        TeamDTO dto = new TeamDTO();
        dto.setId(this.id);
        dto.setName(this.name);
        dto.setManagerId(this.manager != null ? this.manager.getId() : null);
        dto.setEmployeeIds(this.employees != null ? this.employees.stream().map(Employee::getId).toList() : null);
        return dto;
    }
}
