import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimpleBuilderComponent } from './simple-builder/simple-builder.component';


const routes: Routes = [
  {
    path: '',
    component: SimpleBuilderComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
