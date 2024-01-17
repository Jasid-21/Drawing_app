import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { SVGWorkspaceViewComponent } from './views/svgworkspace-view/svgworkspace-view.component';
import { PointComponent } from './components/point/point.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StylesEditorComponent } from './components/styles-editor/styles-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeViewComponent,
    SVGWorkspaceViewComponent,
    PointComponent,
    StylesEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
