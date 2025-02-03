import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTemplateComponent } from './components/list-template/list-template.component';

const routes: Routes = [
  { path: 'list-template', component: ListTemplateComponent  },
  { path: '', redirectTo: 'list-template', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrTemplateGeneratorRoutingModule {}