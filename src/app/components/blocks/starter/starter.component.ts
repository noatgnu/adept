import {Component, Input, OnInit} from '@angular/core';
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {FormControl, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {Experiment} from "../../../classes/settings";
import {SettingsService} from "../../../services/settings.service";

@Component({
    selector: 'app-starter',
    templateUrl: './starter.component.html',
    styleUrls: ['./starter.component.css']
})
export class StarterComponent implements OnInit {
  file: File|undefined;
  fileInput: FormControl;
  df: IDataFrame = new DataFrame()
  primaryIdColumns: string[] = []
  sampleColumns: string[] = []
  sampleData: Experiment[] = []
  conditionList: string[] = [];

  constructor(private settings: SettingsService) {
    this.fileInput = new FormControl(Validators.required);
  }

  ngOnInit(): void {

  }

  updateConditionList() {
    for (const c of this.sampleData) {
      if (c.name !== c.condition) {
        if (!(this.conditionList.includes(c.condition))) {
          this.conditionList.push(c.condition)
        }
      }
    }
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

  setSampleData() {
    for (const c of this.sampleColumns) {
      this.sampleData.push({name: c, condition: c})
    }
    console.log(this.sampleData)
  }

  submitStartingBlock() {
    this.settings.settings.experiments = this.sampleData
    this.settings.settings.starterFileColumns = this.df.getColumnNames()
    console.log(this.sampleData)
  }
}
