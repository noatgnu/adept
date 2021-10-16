import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {FormControl, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {Experiment} from "../../../classes/settings";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {MatTable} from "@angular/material/table";
import {DataService} from "../../../services/data.service";

@Component({
    selector: 'app-starter',
    templateUrl: './starter.component.html',
    styleUrls: ['./starter.component.css']
})
export class StarterComponent implements OnInit {
  @ViewChild('table') table: MatTable<Experiment>|undefined;
  @Input() blockID: number = 0
  file: File|undefined;
  fileInput: FormControl;
  df: IDataFrame = new DataFrame()
  primaryIdColumns: string[] = []
  sampleColumns: string[] = []
  sampleData: Experiment[] = []
  conditionList: string[] = [];
  getID: Subscription | undefined;
  rawData: string = ""
  submittedQuery: boolean = false
  tempSampleData: Experiment[] = []
  constructor(public settings: SettingsService, private ws: WebsocketService, private data: DataService) {
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
        this.rawData = <string>e.target.result
      };
      reader.readAsText(this.fileInput.value);
    }
  }

  setSampleData() {
    this.sampleData = []
    this.tempSampleData = []
    for (const c of this.sampleColumns) {
      this.sampleData.push({name: c, condition: c})
      this.tempSampleData.push({name: c, condition: c})
    }

  }

  submitStartingBlock() {
    this.settings.settings.blockMap[this.blockID].completed = false
    this.submittedQuery = true
    this.settings.settings.primaryIDColumns = this.primaryIdColumns
    this.settings.settings.experiments = this.sampleData
    this.settings.settings.starterFileColumns = this.df.getColumnNames()
    this.getID = this.ws.ws.subscribe(data => {
      if (data["origin"] == "request-id") {
        this.settings.settings.uniqueID = data["id"]
        this.ws.sendStarter(this.rawData)
      } else if (data["origin"] == "upload-starter") {
        this.submittedQuery = false
        this.settings.settings.blockMap[this.blockID].completed = true
        this.data.currentDF = fromCSV(<string>data["data"])
        this.data.dfMap[this.blockID] = this.data.currentDF
        this.getID?.unsubscribe()
      }
    })
    this.ws.requestID()
  }

  dropTable(event: CdkDragDrop<Experiment[]>) {
    const prevIndex = this.sampleData.findIndex((d) => d === event.item.data);
    moveItemInArray(this.sampleData, prevIndex, event.currentIndex);
    if (this.table) {
      this.table.renderRows();
    }

  }
}
