import {Component, Input, OnInit} from '@angular/core';
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {DataService} from "../../../services/data.service";
import {Experiment} from "../../../classes/settings";
import {DataFrame, fromCSV, IDataFrame} from "data-forge";

@Component({
  selector: 'app-ttest',
  templateUrl: './ttest.component.html',
  styleUrls: ['./ttest.component.css']
})
export class TtestComponent implements OnInit {
  _blockID: number = 0
  @Input() set blockID(value: number) {
    this._blockID = value
    this.conditions = []
    this.experiments = this.settings.settings.experiments
    this.selectedA = this.experiments[0].condition
    this.selectedB = this.experiments[0].condition
    for (const e of this.experiments) {
      if (!this.conditions.includes(e.condition)) {
        this.conditions.push(e.condition)
      }
    }
  }
  get blockID(): number {
    return this._blockID
  }
  comparisons: any = []
  selectedA: string = ""
  selectedB: string = ""
  experiments: Experiment[] = []
  conditions: string[] = []
  result: IDataFrame = new DataFrame()
  submittedQuery: boolean = false;
  constructor(public settings: SettingsService, private ws: WebsocketService, private data: DataService) {

  }

  ngOnInit(): void {

  }

  addComparison() {
    this.comparisons.push({A: this.selectedA, B: this.selectedB})
  }

  compareData() {
    const ws = this.ws.ws.subscribe(data => {
      this.submittedQuery = false
      this.settings.settings.blockMap[this.blockID].completed = true
      this.data.dfMap[this.blockID] = fromCSV(<string>data["data"])
      this.data.currentDF = this.data.dfMap[this.blockID]
      this.result = this.data.dfMap[this.blockID]
      ws.unsubscribe()
    })
    this.ws.ttestData(this.comparisons)
    this.submittedQuery = true

  }

  download = this.data.downloadData
}
