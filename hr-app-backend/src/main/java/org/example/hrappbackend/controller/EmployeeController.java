package org.example.hrappbackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.hrappbackend.controller.doc.EmployeeApi;
import org.example.hrappbackend.dto.CreateEmployeeRequest;
import org.example.hrappbackend.dto.EmployeeDTO;
import org.example.hrappbackend.dto.UpdateEmployeeRequest;
import org.example.hrappbackend.dto.UpdateOwnProfileRequest;
import org.example.hrappbackend.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController implements EmployeeApi {

    private final EmployeeService employeeService;

    @GetMapping
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'HR', 'ADMIN')")
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'HR', 'ADMIN')")
    public ResponseEntity<EmployeeDTO> getMyProfile() {
        return employeeService.getCurrentEmployeeProfile()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'HR', 'ADMIN')")
    public ResponseEntity<EmployeeDTO> updateMyProfile(@RequestBody UpdateOwnProfileRequest request) {
        return employeeService.updateOwnProfile(request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/managers")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN', 'MANAGER')")
    public ResponseEntity<List<EmployeeDTO>> getManagers() {
        return ResponseEntity.ok(employeeService.getAllEmployees().stream()
                .filter(e -> e.position().toLowerCase().contains("manager") || e.position().toLowerCase().contains("lead"))
                .toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'HR', 'ADMIN')")
    public ResponseEntity<EmployeeDTO> getEmployeeById(UUID id) {
        return employeeService.getEmployeeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('HR', 'ADMIN','MANAGER')")
    public ResponseEntity<EmployeeDTO> createEmployee(CreateEmployeeRequest request) {
        EmployeeDTO created = employeeService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN', 'MANAGER')")
    public ResponseEntity<EmployeeDTO> updateEmployee(UUID id, UpdateEmployeeRequest request) {
        return employeeService.updateEmployee(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER','HR')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable UUID id) {
        boolean deleted = employeeService.deleteEmployee(id);
        return deleted ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}