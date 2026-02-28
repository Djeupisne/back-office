import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { ChipModule } from 'primeng/chip';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { ProgressBarModule } from 'primeng/progressbar';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

const PRIMENG_MODULES = [
  ButtonModule, InputTextModule, TableModule, TagModule, BadgeModule,
  ToastModule, ConfirmDialogModule, DialogModule, DropdownModule,
  CheckboxModule, CalendarModule, ChipModule, CardModule, MenuModule,
  AvatarModule, ProgressBarModule, MultiSelectModule, TooltipModule,
  SkeletonModule, DividerModule, PanelModule, ChartModule,
  InputTextareaModule, InputNumberModule, RadioButtonModule, PasswordModule,
  InputOtpModule, BreadcrumbModule, SplitButtonModule, MessagesModule, MessageModule
];

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ...PRIMENG_MODULES],
  exports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ...PRIMENG_MODULES]
})
export class SharedModule {}
