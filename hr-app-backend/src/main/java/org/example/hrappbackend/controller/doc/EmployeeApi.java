package org.example.hrappbackend.controller.doc;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.hrappbackend.dto.CreateEmployeeRequest;
import org.example.hrappbackend.dto.EmployeeDTO;
import org.example.hrappbackend.dto.UpdateEmployeeRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.UUID;

@Tag(name = "Employees", description = "Employee management APIs")
@RequestMapping("/api/employees")
public interface EmployeeApi {

    @Operation(summary = "Get all employees", description = "Retrieve a list of all employees")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list")
    ResponseEntity<List<EmployeeDTO>> getAllEmployees();

    @Operation(summary = "Get employee by ID", description = "Retrieve a specific employee by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved employee"),
            @ApiResponse(responseCode = "404", description = "Employee not found", content = @Content)
    })
    ResponseEntity<EmployeeDTO> getEmployeeById(
            @Parameter(description = "Employee UUID") @PathVariable UUID id
    );

    @Operation(summary = "Create new employee", description = "Create a new employee record")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Employee created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input", content = @Content)
    })
    ResponseEntity<EmployeeDTO> createEmployee(
            @Parameter(description = "Employee data") @Valid @RequestBody CreateEmployeeRequest request
    );

    @Operation(summary = "Update employee", description = "Update an existing employee record")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Employee updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input", content = @Content),
            @ApiResponse(responseCode = "404", description = "Employee not found", content = @Content)
    })
    ResponseEntity<EmployeeDTO> updateEmployee(
            @Parameter(description = "Employee UUID") @PathVariable UUID id,
            @Parameter(description = "Updated employee data") @Valid @RequestBody UpdateEmployeeRequest request
    );

    @Operation(summary = "Delete employee", description = "Delete an employee by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Employee deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Employee not found", content = @Content)
    })
    ResponseEntity<Void> deleteEmployee(
            @Parameter(description = "Employee UUID") @PathVariable UUID id
    );

}
