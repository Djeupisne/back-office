import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ResidentListComponent } from './resident-list/resident-list.component';
import { ResidentFormComponent } from './resident-form/resident-form.component';

const routes: Routes = [
  { path: '', component: ResidentListComponent },
  { path: 'nouveau', component: ResidentFormComponent },
  { path: 'edit/:id', component: ResidentFormComponent }
];

@NgModule({
  declarations: [ResidentListComponent, ResidentFormComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class ResidentsModule {}
