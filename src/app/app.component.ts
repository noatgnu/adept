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
  file: File|undefined;
  fileInput: FormControl;
  df: IDataFrame = new DataFrame()
  opened: boolean = true
  constructor() {
    this.fileInput = new FormControl(Validators.required);
  }

  blockList: any[] = [{id: 1, title: "Starting Data", active: true}]

  toggleSideNav() {
    this.opened = !this.opened
  }

  onFileSelected() {
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.df = fromCSV(<string>e.target.result)
      };
      reader.readAsText(this.fileInput.value);
    }
  }
}
