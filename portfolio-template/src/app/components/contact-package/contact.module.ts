import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactTemplateComponent } from './contact-template/contact-template.component';
import { AddContactComponent } from './web-service/add-contact/add-contact.component';
import { AllContactComponent } from './web-service/all-contact/all-contact.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule
  ]
})
export class ContactModule { }
