import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {NgxMatFileInputModule} from "@angular-material-components/file-input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatListModule} from "@angular/material/list";
import {MatToolbarModule} from "@angular/material/toolbar";
import { FilterColumnComponent } from './components/blocks/filter-column/filter-column.component';
import { StarterComponent } from './components/blocks/starter/starter.component';
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatChipsModule} from "@angular/material/chips";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { BlockSwitchComponent } from './components/blocks/block-switch/block-switch.component';
import {MatMenuModule} from "@angular/material/menu";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {GoogleChartsModule} from "angular-google-charts";
import { ProfilePlotComponent } from './components/graphs/profile-plot/profile-plot.component';
import { AddGraphButtonComponent } from './components/add-graph-button/add-graph-button.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

@NgModule({
  declarations: [
    AppComponent,
    FilterColumnComponent,
    StarterComponent,
    BlockSwitchComponent,
    ProfilePlotComponent,
    AddGraphButtonComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    NgxMatFileInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatGridListModule,
    MatListModule,
    MatToolbarModule,
    MatTableModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatProgressBarModule,
    MatMenuModule,
    DragDropModule,
    GoogleChartsModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
