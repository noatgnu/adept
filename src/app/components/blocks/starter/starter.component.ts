import {ApplicationRef, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {FormControl, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {Experiment} from "../../../classes/settings";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {MatTable} from "@angular/material/table";
import {DataService} from "../../../services/data.service";
import {Event} from "@angular/router";

@Component({
    selector: 'app-starter',
    templateUrl: './starter.component.html',
    styleUrls: ['./starter.component.css']
})
export class StarterComponent implements OnInit {
  get df(): IDataFrame {
    console.log(this._df)
    return this._df;
  }
  shift: boolean = false
  holdShift(e: any) {
    this.shift = true
  }
  previousClickColumns: number = 0
  releaseShift(e: any) {
    this.shift = false
  }

  clickColumn(colIndex: number) {
    if (this.shift) {
      const columns: string[] = []
      if (this.previousClickColumns !== 0) {
        for (let i = this.previousClickColumns; i <= colIndex; i ++) {
          columns.push(this.columns[i])
        }
        this.sampleColumns = columns
      }

    }
    this.previousClickColumns = colIndex
    console.log(this.sampleColumns)
  }

  @ViewChild('table') table: MatTable<Experiment>|undefined;
  _blockID: number = 0
  @Input() set blockID(value: number) {
    this._blockID = value
  }
  get blockID(): number {
    return this._blockID
  }
  file: File|undefined;
  fileInput: FormControl;
  @Input() set df(value: IDataFrame) {
    this._df = value;
    this.columns = value.getColumnNames()
    this.columns = [...this.columns]
    this.primaryIdColumns = this.settings.settings.primaryIDColumns
    this.sampleData = this.settings.settings.experiments
  }

  private _df: IDataFrame = new DataFrame()
  columns: string[] = []
  primaryIdColumns: string[] = []
  sampleColumns: string[] = []
  sampleData: Experiment[] = []
  conditionList: string[] = [];
  getID: Subscription | undefined;
  submittedQuery: boolean = false
  tempSampleData: Experiment[] = []
  loadedFile: boolean = false
  constructor(public settings: SettingsService, private ws: WebsocketService, private data: DataService, private cd: ChangeDetectorRef) {
    this.fileInput = new FormControl(Validators.required);
    this.settings.newSettingsLoaded.asObservable().subscribe(result => {
      if (result) {
        this.sampleColumns = []
        for (const e of this.settings.settings.experiments) {
          this.sampleColumns.push(e.name)
        }
      }
    })
  }

  ngOnInit(): void {

  }

  clearSelection() {
    this.sampleColumns = []
    this.settings.settings.experiments = []
    this.sampleData = []
    this.previousClickColumns = 0
  }

  updateConditionList() {
    for (const c of this.sampleData) {
      if (c.name !== c.condition) {
        if (c.name !== "") {
          if (!(this.conditionList.includes(c.condition))) {
            this.conditionList.push(c.condition)
          }
        }
      }
    }
  }

  onFileSelected() {
    this.loadedFile = false
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this._df = fromCSV(<string>e.target.result)
        this.loadedFile = true
        this.columns = this._df.getColumnNames()
        this.columns = [...this.columns]
      };
      reader.readAsText(this.fileInput.value);
    }
  }

  setSampleData() {
    if (this.sampleColumns.length > 0) {
      this.sampleData = []
      this.tempSampleData = []
      for (const c of this.sampleColumns) {
        this.sampleData.push({name: c, condition: c})
        this.tempSampleData.push({name: c, condition: c})
      }
    }
  }

  submitStartingBlock() {
    if (!this.ws.lock) {
      this.ws.activeBlock = this.blockID
      this.settings.settings.blockMap[this.blockID].completed = false
      this.submittedQuery = true
      this.settings.settings.primaryIDColumns = this.primaryIdColumns
      this.settings.settings.experiments = this.sampleData

      this.settings.settings.starterFileColumns = this._df.getColumnNames()
      this.getID = this.ws.ws.subscribe(data => {
        if (data["origin"] == "request-id") {
          this.settings.settings.uniqueID = data["id"]
          this.ws.sendStarter(this._df.toJSON())
        } else if (data["origin"] == "upload-starter") {
          this.submittedQuery = false
          this.data.updateDataState(this.blockID, data["data"])
          this.ws.lock = false
          this.getID?.unsubscribe()
        }
      })
      this.ws.lock = true

      this.ws.requestID()
    }

  }

  dropTable(event: CdkDragDrop<Experiment[]>) {
    const prevIndex = this.sampleData.findIndex((d) => d === event.item.data);
    moveItemInArray(this.sampleData, prevIndex, event.currentIndex);
    if (this.table) {
      this.table.renderRows();
    }
  }

  ViewInputData() {
    this.data.viewData(this.data.dfMap[1].head(10).bake())
  }

  parseConditions() {
    const pattern = new RegExp(/(\w+)\.(\d+)$/)
    for (const e of this.sampleData) {
      const match = e.name.match(pattern)
      if (match) {
        e.condition = match[1]
      }
    }
  }
}
