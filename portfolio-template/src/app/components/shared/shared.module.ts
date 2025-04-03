import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [NavbarComponent, FooterComponent],
  imports: [
    CommonModule,
    RouterModule, // Pour que les liens dans le menu fonctionnent
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
    
  ],
  exports: [NavbarComponent, FooterComponent] // On exporte pour les utiliser partout
})
export class SharedModule { }
