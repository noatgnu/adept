import { Component } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {DataFrame, fromCSV, IDataFrame} from "data-forge";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'adept';

  opened: boolean = true
  constructor() {

  }

  blockList: any[] = [{id: 1, title: "Starting Data", active: true}]

  toggleSideNav() {
    this.opened = !this.opened
  }


}
