import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {DataFrame, fromCSV, fromJSON, IDataFrame} from "data-forge";
import {WebsocketService} from "./services/websocket.service";
import {SettingsService} from "./services/settings.service";
import {Block, ExportData} from "./classes/settings";
import {toArray} from "rxjs/operators";
import {DataService} from "./services/data.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'adept';

  constructor () {

  }


}
