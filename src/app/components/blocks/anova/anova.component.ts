import {Component, Input, OnInit} from '@angular/core';
import {Experiment} from "../../../classes/settings";
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-anova',
  templateUrl: './anova.component.html',
  styleUrls: ['./anova.component.css']
})
export class AnovaComponent implements OnInit {
  _blockID: number = 0
  @Input() set blockID(value: number) {
    this._blockID = value
    this.conditions = []
    this.experiments = this.settings.settings.experiments
    this.selected = []
    for (const e of this.experiments) {
      if (!this.conditions.includes(e.condition)) {
        this.conditions.push(e.condition)
      }
    }
  }
  get blockID(): number {
    return this._blockID
  }
  selected: string[] = []
  experiments: Experiment[] = []
  conditions: string[] = []
  result: IDataFrame = new DataFrame()
  submittedQuery: boolean = false;
  constructor(public settings: SettingsService, private ws: WebsocketService, private data: DataService) {
    this.selected = this.conditions.slice()
  }

  ngOnInit(): void {

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
    this.ws.anova(this.selected)
    this.submittedQuery = true

  }

  download = this.data.downloadData
}
