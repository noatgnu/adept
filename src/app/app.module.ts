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
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { ProfilePlotComponent } from './components/graphs/profile-plot/profile-plot.component';
import { AddGraphButtonComponent } from './components/add-graph-button/add-graph-button.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { ImputationComponent } from './components/blocks/imputation/imputation.component';
import { BoxPlotComponent } from './components/graphs/box-plot/box-plot.component';
import { NormalizeComponent } from './components/blocks/normalize/normalize.component';
import { TtestComponent } from './components/blocks/ttest/ttest.component';
import {MatExpansionModule} from "@angular/material/expansion";
import { PCorrectionComponent } from './components/blocks/p-correction/p-correction.component';
import { VolcanoPlotComponent } from './components/graphs/volcano-plot/volcano-plot.component';
import { AnovaComponent } from './components/blocks/anova/anova.component';
import { FuzzyComponent } from './components/blocks/fuzzy/fuzzy.component';
import { SetDfAsCurrentComponent } from './components/blocks/set-df-as-current/set-df-as-current.component';
import {MatDialogModule} from "@angular/material/dialog";
import { ViewDatatableComponent } from './components/view-datatable/view-datatable.component';
import { SavingDataComponent } from './components/saving-data/saving-data.component';
import { FuzzyPlotComponent } from './components/graphs/fuzzy-plot/fuzzy-plot.component';
import { PCAPlotComponent } from './components/graphs/pca-plot/pca-plot.component';
import { HeatmapComponent } from './components/graphs/heatmap/heatmap.component';
import { BlockDeletePromptComponent } from './components/block-delete-prompt/block-delete-prompt.component';
import { GraphDeletePromptComponent } from './components/graph-delete-prompt/graph-delete-prompt.component';
import { BarChartComponent } from './components/graphs/bar-chart/bar-chart.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClientModule} from "@angular/common/http";
import { CurtainUploaderComponent } from './components/curtain-uploader/curtain-uploader.component';
import {MatStepperModule} from "@angular/material/stepper";
import { CorrelationMatrixComponent } from './components/blocks/correlation-matrix/correlation-matrix.component';
import {AppRoutingModule} from "./app-routing.module";
import { HomeComponent } from './components/home/home.component';
PlotlyModule.plotlyjs = PlotlyJS;
@NgModule({
  declarations: [
    AppComponent,
    FilterColumnComponent,
    StarterComponent,
    BlockSwitchComponent,
    ProfilePlotComponent,
    AddGraphButtonComponent,
    ImputationComponent,
    BoxPlotComponent,
    NormalizeComponent,
    TtestComponent,
    PCorrectionComponent,
    VolcanoPlotComponent,
    AnovaComponent,
    FuzzyComponent,
    SetDfAsCurrentComponent,
    ViewDatatableComponent,
    SavingDataComponent,
    FuzzyPlotComponent,
    PCAPlotComponent,
    HeatmapComponent,
    BlockDeletePromptComponent,
    GraphDeletePromptComponent,
    BarChartComponent,
    CurtainUploaderComponent,
    CorrelationMatrixComponent,
    HomeComponent
  ],
  imports: [
    AppRoutingModule,
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
    MatSlideToggleModule,
    PlotlyModule,
    MatExpansionModule,
    MatDialogModule,
    HttpClientModule,
    MatStepperModule
  ],
  providers: [MatSnackBar],
  bootstrap: [AppComponent]
})
export class AppModule { }
