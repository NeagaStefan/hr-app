package org.example.hrappbackend.service;

import org.example.hrappbackend.dto.CreateEmployeeRequest;
import org.example.hrappbackend.dto.EmployeeDTO;
import org.example.hrappbackend.dto.UpdateEmployeeRequest;
import org.example.hrappbackend.dto.UpdateOwnProfileRequest;
import org.example.hrappbackend.entity.Employee;
import org.example.hrappbackend.entity.User;
import org.example.hrappbackend.exception.DuplicateEmailException;
import org.example.hrappbackend.repository.EmployeeRepository;
import org.example.hrappbackend.repository.TeamRepository;
import org.example.hrappbackend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private TeamRepository teamRepository;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private EmployeeService employeeService;

    private User user;
    private Employee employee;
    private UUID employeeId;

    @BeforeEach
    void setUp() {
        employeeId = UUID.randomUUID();
        employee = new Employee();
        employee.setId(employeeId);
        employee.setFirstName("John");
        employee.setLastName("Doe");
        employee.setEmail("john.doe@example.com");

        user = new User();
        user.setUsername("johndoe");
        user.setEmployee(employee);

        SecurityContextHolder.setContext(securityContext);
    }

    private void mockUserWithRole(String username, String role) {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(username);
        when(authentication.getAuthorities()).thenReturn((Collection) Collections.singletonList(new SimpleGrantedAuthority(role)));
    }

    private void mockUserRepository(String username) {
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
    }

    @Test
    void getCurrentEmployeeProfile_returnsProfile_whenUserExists() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("johndoe");
        mockUserRepository("johndoe");

        Optional<EmployeeDTO> result = employeeService.getCurrentEmployeeProfile();

        assertTrue(result.isPresent());
        assertEquals(employeeId, result.get().id());
    }

    @Test
    void getAllEmployees_asAdmin_returnsAll() {
        mockUserWithRole("admin", "ROLE_ADMIN");
        when(employeeRepository.findAll()).thenReturn(List.of(employee));

        List<EmployeeDTO> result = employeeService.getAllEmployees();

        assertEquals(1, result.size());
    }

    @Test
    void getAllEmployees_asManager_returnsDirectReports() {
        mockUserWithRole("manager", "ROLE_MANAGER");
        mockUserRepository("manager");
        Employee report = new Employee();
        report.setManager(employee);
        when(employeeRepository.findAll()).thenReturn(List.of(employee, report));

        List<EmployeeDTO> result = employeeService.getAllEmployees();

        assertEquals(1, result.size());
        assertEquals(report.getId(), result.getFirst().id());
    }

    @Test
    void getEmployeeById_asHr_returnsEmployee() {
        mockUserWithRole("hr", "ROLE_HR");
        when(employeeRepository.getEmployeeById(employeeId)).thenReturn(Optional.of(employee));

        Optional<EmployeeDTO> result = employeeService.getEmployeeById(employeeId);

        assertTrue(result.isPresent());
        assertEquals(employeeId, result.get().id());
    }

    @Test
    void createEmployee_succeeds() {
        mockUserWithRole("hr", "ROLE_HR");
        CreateEmployeeRequest request = new CreateEmployeeRequest("New", "User", "new@user.com", "Dev", "IT", LocalDate.now(), BigDecimal.ONE, null, List.of());
        when(employeeRepository.findByEmail("new@user.com")).thenReturn(Optional.empty());
        when(employeeRepository.save(any(Employee.class))).thenAnswer(i -> i.getArgument(0));

        EmployeeDTO result = employeeService.createEmployee(request);

        assertNotNull(result);
        assertEquals("new@user.com", result.email());
    }

    @Test
    void createEmployee_withDuplicateEmail_throwsException() {
        mockUserWithRole("hr", "ROLE_HR");
        CreateEmployeeRequest request = new CreateEmployeeRequest("New", "User", "john.doe@example.com", "Dev", "IT", LocalDate.now(), BigDecimal.ONE, null, List.of());
        when(employeeRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(employee));

        assertThrows(DuplicateEmailException.class, () -> employeeService.createEmployee(request));
    }

    @Test
    void updateEmployee_asManager_succeedsForDirectReport() {
        mockUserWithRole("manager", "ROLE_MANAGER");
        mockUserRepository("manager");
        Employee report = new Employee();
        report.setId(UUID.randomUUID());
        report.setFirstName("Jane");
        report.setLastName("Smith");
        report.setEmail("jane.smith@example.com");
        report.setPosition("Developer");
        report.setDepartment("IT");
        report.setManager(employee);
        UpdateEmployeeRequest request = new UpdateEmployeeRequest("Jane", "Doe", "jane.doe@example.com", "Sr. Dev", "IT", LocalDate.now(), BigDecimal.TEN, employeeId, List.of());

        when(employeeRepository.getEmployeeById(report.getId())).thenReturn(Optional.of(report));
        when(employeeRepository.findByEmail("jane.doe@example.com")).thenReturn(Optional.empty());
        when(employeeRepository.save(any(Employee.class))).thenAnswer(i -> i.getArgument(0));

        Optional<EmployeeDTO> result = employeeService.updateEmployee(report.getId(), request);

        assertTrue(result.isPresent());
        assertEquals("Jane", result.get().firstName());
    }

    @Test
    void updateEmployee_asManager_failsForSelf() {
        mockUserWithRole("manager", "ROLE_MANAGER");
        mockUserRepository("manager");
        UpdateEmployeeRequest request = new UpdateEmployeeRequest("Jane", "Doe", "jane.doe@example.com", "Sr. Dev", "IT", LocalDate.now(), BigDecimal.TEN, employeeId, List.of());
        when(employeeRepository.getEmployeeById(employeeId)).thenReturn(Optional.of(employee));

        assertThrows(SecurityException.class, () -> employeeService.updateEmployee(employeeId, request));
    }

    @Test
    void deleteEmployee_succeeds() {
        employee.setTeams(new HashSet<>());
        when(employeeRepository.getEmployeeById(employeeId)).thenReturn(Optional.of(employee));
        when(userRepository.findByEmployee(employee)).thenReturn(Optional.of(user));

        boolean result = employeeService.deleteEmployee(employeeId);

        assertTrue(result);
        verify(employeeRepository, times(1)).deleteByIdEquals(employeeId);
        verify(userRepository, times(1)).delete(user);
    }

    @Test
    void updateOwnProfile_succeeds() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("johndoe");
        mockUserRepository("johndoe");
        UpdateOwnProfileRequest request = new UpdateOwnProfileRequest("John", "Doe", "new.email@example.com", "Sr. Dev", "IT", List.of());
        when(employeeRepository.getEmployeeById(employeeId)).thenReturn(Optional.of(employee));
        when(employeeRepository.save(any(Employee.class))).thenAnswer(i -> i.getArgument(0));

        Optional<EmployeeDTO> result = employeeService.updateOwnProfile(request);

        assertTrue(result.isPresent());
        assertEquals("new.email@example.com", result.get().email());
    }
}
