import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-imputation',
  templateUrl: './imputation.component.html',
  styleUrls: ['./imputation.component.css']
})
export class ImputationComponent implements OnInit {
  @Output() parameters: EventEmitter<any> = new EventEmitter<any>()
  _blockID: number = 0
  @Input() set blockID(value: number) {
    this._blockID = value
    if (Object.keys(this.settings.settings.blocks[this._blockID-1].parameters).length > 0) {
      this.config = this.settings.settings.blocks[this._blockID-1].parameters.config
      this.chosenMethod = this.settings.settings.blocks[this._blockID-1].parameters.chosenMethod
    }
  }
  get blockID(): number {
    return this._blockID
  }
  methods: string[] = ["Simple", "Random Forest", "Left Censored Median"]
  chosenMethod: string = "Random Forest"
  config: any = {
    "Simple": {
      "# good values/condition": 0,
      "# good condition/row": 0,
    }, "Left Censored Median": {
      "Down-shift": 0,
      "Width": 0,
      "# missing values/condition": 0,
    }, "Random Forest": {
      "# missing values/condition": 0,
    }
  }

  submittedQuery = false

  description: any = {
    "Simple": "Imputation by removal of row with missing data over the threshold number",
    "Left Censored Median": "Imputation by replacing missing data with those generated from a dataset of random distribution centered on median - down shift value",
    "Random Forest": "Imputation by replacing missing data with those generated from Random Forest algorithm"
  }
  result: IDataFrame = new DataFrame()
  constructor(public settings: SettingsService, private ws: WebsocketService, private data: DataService) { }

  ngOnInit(): void {
  }

  getKey() {
    const data = []
    for (const i in this.config[this.chosenMethod]) {
      data.push(i)
    }
    return data
  }

  imputeData() {
    this.ws.activeBlock = this.blockID
    const ws = this.ws.ws.subscribe(data => {
      this.submittedQuery = false
      this.data.updateDataState(this.blockID, data["data"])
      this.result = this.data.currentDF
      ws.unsubscribe()
    })
    this.submittedQuery = true
    this.parameters.emit({chosenMethod: this.chosenMethod, config: this.config[this.chosenMethod]})
    this.ws.imputeData(this.chosenMethod, this.config[this.chosenMethod])
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
