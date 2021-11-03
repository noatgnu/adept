import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Output() parameters: EventEmitter<any> = new EventEmitter<any>()
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
    if (Object.keys(this.settings.settings.blocks[this._blockID-1].parameters).length > 0) {
      this.selected = this.settings.settings.blocks[this._blockID-1].parameters.selected
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
      this.data.updateDataState(this.blockID, data["data"])
      this.result = this.data.dfMap[this.blockID]
      ws.unsubscribe()
    })
    this.parameters.emit({selected: this.selected})
    this.ws.anova(this.selected)
    this.submittedQuery = true

  }

  download() {
    this.data.downloadData(this.blockID)
  }

  delete() {
    this.data.deleteBlock(this._blockID)
  }

  ViewInputData() {
    this.data.viewData(this.data.dfMap[this._blockID - 1].head(10).bake())
  }
}
