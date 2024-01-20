import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { SVGWorkspaceViewComponent } from './views/svgworkspace-view/svgworkspace-view.component';
import { PointComponent } from './components/point/point.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StylesEditorComponent } from './components/styles-editor/styles-editor.component';
import { FormEditorComponent } from './components/form-editor/form-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeViewComponent,
    SVGWorkspaceViewComponent,
    PointComponent,
    StylesEditorComponent,
    FormEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
