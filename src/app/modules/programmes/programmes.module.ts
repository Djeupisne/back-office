import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProgrammeListComponent } from './programme-list/programme-list.component';
import { ProgrammeFormComponent } from './programme-form/programme-form.component';

const routes: Routes = [
  { path: '', component: ProgrammeListComponent },
  { path: 'nouveau', component: ProgrammeFormComponent },
  { path: 'edit/:id', component: ProgrammeFormComponent }
];

@NgModule({
  declarations: [ProgrammeListComponent, ProgrammeFormComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class ProgrammesModule {}
