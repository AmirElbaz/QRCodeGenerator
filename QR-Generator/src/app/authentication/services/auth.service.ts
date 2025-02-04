import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, tap, catchError, throwError, BehaviorSubject } from 'rxjs';
import { RegisterModel } from '../viewmodels/register-model';
import { log } from 'console';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl: string | null = null;
  private apiUrl ='https://localhost:7110/api/Authenticate'
  private jwtHelper = new JwtHelperService();
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedIn.asObservable();
  
  constructor(private httpClient: HttpClient) {
    // Initialize authentication state when service is created
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    // Check if user is authenticated when service initializes
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.isLoggedIn.next(true);
    } else {
      // If token is invalid or expired, clean up
      this.logout();
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

   checkAuthenticationState(): void {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.isLoggedIn.next(true);
    } else {
      this.isLoggedIn.next(false);
    }
  }

  getUserRole(): string | null {
    console.log('Stored role:', localStorage.getItem('role'));
    return localStorage.getItem('role');

  }
  
  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const roles = decodedToken.role || decodedToken['role'] || decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      console.log('Roles:', roles);
      return roles === 'Admin';
    }
    return false;
  }
  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        
        localStorage.setItem("token", response.token);
        this.isLoggedIn.next(true);
      }),
      catchError(this.handleError)
    );
  }
  
  register(registrationData: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}/register`,
      registrationData
    ).pipe(
      tap((response) => {
        localStorage.setItem("token", response.token);
        this.isLoggedIn.next(true);
      }),
      catchError(this.handleError)
    );
  }

  getUserName(): string | null {
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.name || null;
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem('role');
    this.isLoggedIn.next(false);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.status === 401) {
      errorMessage = 'Invalid email or password.';
    } else if (error.status === 400) {
      errorMessage = 'Bad request. Please check your input.';
    }
    return throwError(() => new Error(errorMessage));
  }
}
