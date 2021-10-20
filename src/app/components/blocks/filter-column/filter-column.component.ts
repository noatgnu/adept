import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Experiment} from "../../../classes/settings";
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {DataService} from "../../../services/data.service";
import {Subject} from "rxjs";
import {MatTable} from "@angular/material/table";

@Component({
  selector: 'app-filter-column',
  templateUrl: './filter-column.component.html',
  styleUrls: ['./filter-column.component.css']
})
export class FilterColumnComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>|undefined;
  _blockID: number = 0
  @Input() set blockID(value: number) {
    this._blockID = value
    this.filterSteps = []
    this.columns = this.data.dfMap[value-1].getColumnNames()
  }
  get blockID(): number {
    return this._blockID
  }
  columns: string[] = []
  operator: string[] = ["==", ">", ">=", "<=", "<"]
  result: IDataFrame = new DataFrame()
  submittedQuery: boolean = false;
  chosenColumn: string = ""
  chosenOperator: string = ""
  value: string = ""
  valueType: string = ""
  keepRemove: boolean = false
  filterSteps: any[] = []
  dataSubject: Subject<any> = new Subject<any>()
  constructor(public settings: SettingsService, private ws: WebsocketService, private data: DataService) {
    this.data.updateParametersSubject.asObservable().subscribe(data => {
      if (data) {
        if (data.id === this.blockID-1) {
          this.columns = this.data.dfMap[this.blockID-1].getColumnNames()
        }
      }
    })
  }

  ngOnInit(): void {

  }

  addFilter() {
    this.filterSteps.push({column: this.chosenColumn, operator: this.chosenOperator, keep: this.keepRemove, value: this.value, valueType: this.valueType})
    if (this.table) {
      this.table.renderRows()
    }
  }

  filterData() {
    const ws = this.ws.ws.subscribe(data => {
      this.submittedQuery = false
      this.data.updateDataState(this.blockID, data["data"])
      this.result = this.data.dfMap[this.blockID]
      ws.unsubscribe()
    })
    this.ws.filterData(this.filterSteps)
    this.submittedQuery = true

  }

  download = this.data.downloadData
}
