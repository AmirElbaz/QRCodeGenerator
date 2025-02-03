import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  showModal: boolean = false;
  isLoading: boolean = false;
  loginSuccess: boolean = false;
  loginError: boolean = false;
  showErrorSummary: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.showErrorSummary = true;
      return;
    }

    this.showErrorSummary = false;
    this.showModal = true;
    this.isLoading = true;
    this.loginSuccess = false;
    this.loginError = false;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.isLoading = false;
          this.loginSuccess = true;

          setTimeout(() => {
            this.showModal = false; 
            this.router.navigate(['QRCodeGenerator/qrgenerator']); 
          }, 1000);
        }, 1000); 
      },
      error: (error) => {
        setTimeout(() => {
          this.isLoading = false;
          this.loginError = true;

          setTimeout(() => {
            this.showModal = false; 
          }, 1000);
        }, 1000); 

        console.error('Login failed:', error);
      }
    });
  }
}
