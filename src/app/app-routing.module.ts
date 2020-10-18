import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveBuilderComponent } from './live-builder/live-builder.component';
import { SimpleBuilderComponent } from './simple-builder/simple-builder.component';
import { TheEyeComponent } from './the-eye/the-eye.component';


const routes: Routes = [
    {
        path: '',
        component: SimpleBuilderComponent
    },
    {
        path: 'live',
        component: LiveBuilderComponent
    },
    {
        path: 'map',
        component: TheEyeComponent
  }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
