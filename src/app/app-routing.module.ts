import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SVGWorkspaceViewComponent } from './views/svgworkspace-view/svgworkspace-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';

const routes: Routes = [
  { path: '', component: HomeViewComponent },
  { path: 'svg', component: SVGWorkspaceViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
