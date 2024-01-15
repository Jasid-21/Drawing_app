import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { SVGWorkspaceViewComponent } from './views/svgworkspace-view/svgworkspace-view.component';
import { PointComponent } from './components/point/point.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeViewComponent,
    SVGWorkspaceViewComponent,
    PointComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
