import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTable} from "@angular/material/table";
import {Experiment} from "../../../classes/settings";
import {DataFrame, IDataFrame} from "data-forge";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-limma',
  templateUrl: './limma.component.html',
  styleUrls: ['./limma.component.css']
})
export class LimmaComponent implements OnInit {

  _blockID: number = 0
  @ViewChild(MatTable) table: MatTable<any>|undefined;
  @Output() parameters: EventEmitter<any> = new EventEmitter<any>();
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
    if (Object.keys(this.settings.settings.blocks[this._blockID-1].parameters).length > 0) {
      this.comparisons = this.settings.settings.blocks[this._blockID-1].parameters.comparisons
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
    this.table?.renderRows()
  }

  compareData() {
    if (!this.ws.lock) {
      this.ws.activeBlock = this.blockID
      const ws = this.ws.ws.subscribe(data => {
        this.submittedQuery = false
        this.data.updateDataState(this.blockID, data["data"])
        this.result = this.data.dfMap[this.blockID]
        this.ws.lock = false
        ws.unsubscribe()
      })
      this.ws.lock = true

      this.parameters.emit({comparisons: this.comparisons})
      this.ws.ttestData(this.comparisons)
      this.submittedQuery = true
    }
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
