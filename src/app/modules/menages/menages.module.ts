import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MenageListComponent } from './menage-list/menage-list.component';
import { MenageFormComponent } from './menage-form/menage-form.component';
import { MenageDetailComponent } from './menage-detail/menage-detail.component';

// PrimeNG modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MessageModule } from 'primeng/message';

const routes: Routes = [
  { path: '', component: MenageListComponent },
  { path: 'nouveau', component: MenageFormComponent },
  { path: 'edit/:id', component: MenageFormComponent },
  { path: ':id', component: MenageDetailComponent }
];

@NgModule({
  declarations: [
    MenageListComponent,
    MenageFormComponent,
    MenageDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TableModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CheckboxModule,
    CalendarModule,
    CardModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    ProgressSpinnerModule,
    ToolbarModule,
    SplitButtonModule,
    MessageModule,
    SharedModule
  ]
})
export class MenagesModule { }