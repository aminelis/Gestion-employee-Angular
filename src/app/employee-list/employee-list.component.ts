import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  newEmployee: Employee = new Employee();
  searchTerm: string = '';
  p: number = 1;  // Current page number
  itemsPerPage: number = 5;
  
  sortColumn: string = 'id'; // Colonne de tri initiale
sortDirection: 'asc' | 'desc' = 'asc'; // Direction de tri initiale


  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private library: FaIconLibrary
  ) {
    library.addIcons(faSortUp, faSortDown);
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.employeeService.getEmployeesList().subscribe(data => {
      this.employees = data;
      this.filteredEmployees = data;  // Initialize filteredEmployees with all employees
      this.sortEmployees(this.filteredEmployees); // Sort initially by ID or any default column
    });
  }

  addEmployee(): void {
    this.employeeService.addEmployee(this.newEmployee).subscribe(data => {
      console.log(data);
      this.getEmployees();
      this.newEmployee = new Employee();  // Reset newEmployee after adding
    });
  }

  filterEmployees(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter(employee => this.containsSearchTerm(employee, term));
    this.sortEmployees(this.filteredEmployees); // Call sortEmployees after filtering
  }

  containsSearchTerm(employee: Employee, searchTerm: string): boolean {
    return Object.values(employee).some(value =>
      value?.toString().toLowerCase().includes(searchTerm)
    );
  }

  deleteEmployee(id: number): void {
    if (confirm("Are you sure to delete Employee ID: " + id)) {
      this.employeeService.deleteEmployee(id).subscribe(data => {
        console.log(data);
        this.getEmployees();
      });
    }
  }

  detailsOfEmployee(id: number): void {
    this.router.navigate(['details-of-employee', id]);
  }

  
  sortEmployees(filtered: Employee[]): void {
    if (!this.sortColumn) {
      this.filteredEmployees = filtered; // Pas de tri si aucune colonne de tri n'est spécifiée
      return;
    }

    this.filteredEmployees = filtered.sort((a, b) => {
      const aValue = (a as any)[this.sortColumn];
      const bValue = (b as any)[this.sortColumn];

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  setSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortEmployees(this.filteredEmployees); // Apply sorting after changing sort criteria
  }

  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
    }
    return '';
  }

}
