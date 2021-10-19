import {Component, Input, OnInit} from '@angular/core';
import {Experiment} from "../../../classes/settings";
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-filter-column',
  templateUrl: './filter-column.component.html',
  styleUrls: ['./filter-column.component.css']
})
export class FilterColumnComponent implements OnInit {

  _blockID: number = 0
  @Input() set blockID(value: number) {
    this._blockID = value
    this.filterSteps = []
    this.columns = this.data.dfMap[value].getColumnNames()
  }
  get blockID(): number {
    return this._blockID
  }
  selected: string[] = []
  columns: string[] = []
  operator: string[] = ["==", ">", ">=", "<=", "<"]
  result: IDataFrame = new DataFrame()
  submittedQuery: boolean = false;
  chosenColumn: string = ""
  chosenOperator: string = ""
  keepRemove: boolean = false
  filterSteps: any[] = []
  constructor(public settings: SettingsService, private ws: WebsocketService, private data: DataService) {

  }

  ngOnInit(): void {

  }

  addFilter() {
    this.filterSteps.push({column: this.chosenColumn, operator: this.chosenOperator, keep: this.keepRemove})
  }

  filterData() {
    const ws = this.ws.ws.subscribe(data => {
      this.submittedQuery = false
      this.settings.settings.blockMap[this.blockID].completed = true
      this.data.dfMap[this.blockID] = fromCSV(<string>data["data"])
      this.data.currentDF = this.data.dfMap[this.blockID]
      this.result = this.data.dfMap[this.blockID]
      ws.unsubscribe()
    })
    this.ws.anova(this.selected)
    this.submittedQuery = true

  }

  download = this.data.downloadData
}
