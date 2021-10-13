import {Component, Input, OnInit} from '@angular/core';
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {FormControl, Validators} from "@angular/forms";

@Component({
    selector: 'app-starter',
    templateUrl: './starter.component.html',
    styleUrls: ['./starter.component.css']
})
export class StarterComponent implements OnInit {
  file: File|undefined;
  fileInput: FormControl;
  df: IDataFrame = new DataFrame()

  constructor() {
    this.fileInput = new FormControl(Validators.required);
  }

  ngOnInit(): void {
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
