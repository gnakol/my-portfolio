import { Component } from '@angular/core';
import { AuthenticationService } from '../../pages/authenticate/core/authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  isAuthenticated: boolean = false;

  constructor(public authService : AuthenticationService){}

  ngOnInit(): void {
    this.authService.getAuthStatus().subscribe(status => {
      this.isAuthenticated = status;
    });
  }

  logout(): void {
    this.authService.logout();
  }

}
