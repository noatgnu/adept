import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {DataService} from "../../../services/data.service";
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {Experiment} from "../../../classes/settings";

@Component({
  selector: 'app-normalize',
  templateUrl: './normalize.component.html',
  styleUrls: ['./normalize.component.css']
})
export class NormalizeComponent implements OnInit {
  @Output() parameters: EventEmitter<any> = new EventEmitter<any>()
  _blockID: number = 0
  @Input() set blockID(value: number) {
    this._blockID = value
    if (Object.keys(this.settings.settings.blocks[this._blockID-1].parameters).length > 0) {
      this.chosenMethod = this.settings.settings.blocks[this._blockID-1].parameters.chosenMethod
    }

  }
  get blockID(): number {
    return this._blockID
  }
  methods: string[] = ["Mean", "Median", "Z-Score Row", "Z-Score Column", "Quantile"]
  description: any = {
    "Mean": "Perform normalization to center data around sample's mean",
    "Median": "Perform normalization to center data around sample's median",
    "Z-Score Row": "Perform normalization row-wise. Firstly, rows are normalized by their mean then divided by their standard deviation",
    "Z-Score Column": "Perform normalization column-wise. Firstly, columns are normalized by their mean then divided by their standard deviation",
    "Quantile": "Perform normalization based on rank of the value and mean of values with the same rank.",
  }
  chosenMethod = "Median"
  submittedQuery = false
  result: IDataFrame = new DataFrame()
  before: any = {}
  after: any = {}
  experiments: Experiment[] = []
  constructor(public settings: SettingsService, private ws: WebsocketService, private data: DataService) { }

  ngOnInit(): void {
  }

  normalizeData() {
    if (!this.ws.lock) {
      this.ws.activeBlock = this.blockID
      const ws = this.ws.ws.subscribe(data => {
        this.submittedQuery = false
        this.data.updateDataState(this.blockID, data["data"])
        this.result = this.data.dfMap[this.blockID]
        this.experiments = this.settings.settings.experiments
        for (const c of this.experiments) {
          const col = this.data.dfMap[this.blockID-1].getSeries(c.name).bake()
          this.before[c.name] = {}
          this.after[c.name] = {}
          this.before[c.name]["mean"] = col.average()
          this.before[c.name]["median"] = col.median()
          this.before[c.name]["max"] = col.max()
          this.before[c.name]["min"] = col.min()
          const colAfter = this.result.getSeries(c.name).bake()
          this.after[c.name]["mean"] = colAfter.average()
          this.after[c.name]["median"] = colAfter.median()
          this.after[c.name]["max"] = colAfter.max()
          this.after[c.name]["min"] = colAfter.min()

        }
        this.ws.lock = false
        ws.unsubscribe()
      })
      this.ws.lock = true
      this.submittedQuery = true
      this.parameters.emit({chosenMethod: this.chosenMethod})
      this.ws.normalizeData(this.chosenMethod)
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
