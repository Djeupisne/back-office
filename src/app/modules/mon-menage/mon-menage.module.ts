// src/app/modules/mon-menage/mon-menage.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MonMenageComponent } from './mon-menage/mon-menage.component';
import { SharedModule } from '../../shared/shared.module';

// Importez les modules PrimeNG nécessaires
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';

const routes: Routes = [
  { path: '', component: MonMenageComponent }
];

@NgModule({
  declarations: [MonMenageComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ProgressSpinnerModule,
    TabViewModule,
    CardModule,
    TagModule,
    TableModule,
    MessageModule
  ]
})
export class MonMenageModule { }