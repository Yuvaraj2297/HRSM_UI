import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  EMPLOYEES,
  Employee
} from '../../employee-model';

@Component({
  selector: 'app-employee-view',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './employee-view.html',

  styleUrl: './employee-view.scss'
})
export class EmployeeView implements OnInit {

  /* =========================================================
     EMPLOYEE
  ========================================================== */

  employee: Employee | undefined;


  /* =========================================================
     CONSTRUCTOR
  ========================================================== */

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}


  /* =========================================================
     INIT
  ========================================================== */

  ngOnInit(): void {

    const empId = this.route.snapshot.queryParamMap.get('id');

    if (!empId) {
      return;
    }

    this.employee = EMPLOYEES.find(
      (employee: Employee) => employee.empId === empId
    );

  }


  /* =========================================================
     BACK
  ========================================================== */

  goBack(): void {

    this.router.navigate(['/employees']);

  }

}