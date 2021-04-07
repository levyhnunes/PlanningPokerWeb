import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.loginForm = this.formBuilder.group({
      userName: [null, [Validators.required]]
    });
  }

  submitForm() {
    localStorage.setItem("@planning-poker:user", this.loginForm.value.userName);
    this.router.navigate(['room']);
  }
}
