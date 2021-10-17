import {Component, Input, OnInit} from '@angular/core';
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
  _blockID: number = 0
  @Input() set blockID(value: number) {
    this._blockID = value
  }
  get blockID(): number {
    return this._blockID
  }
  methods: string[] = ["Simple", "Random Forest", "Left Censored Median"]
  choosenMethod: string = "Random Forest"
  parameters: any = {
    "Simple": {
      "# missing values/condition": 0,
      "# missing values/row": 0,
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
    "Left Censored Median": "Imputation by replacing missing data with those generated from a dataset of random distribution centered on <i>median - down shift value</i>",
    "Random Forest": "Imputation by replacing missing data with those generated from Random Forest algorithm"
  }
  result: IDataFrame = new DataFrame()
  constructor(public settings: SettingsService, private ws: WebsocketService, private data: DataService) { }

  ngOnInit(): void {
  }

  getKey() {
    const data = []
    for (const i in this.parameters[this.choosenMethod]) {
      data.push(i)
    }
    return data
  }

  imputeData() {
    const ws = this.ws.ws.subscribe(data => {
      this.submittedQuery = false
      this.settings.settings.blockMap[this.blockID].completed = true
      this.data.currentDF = fromCSV(<string>data["data"])
      this.data.dfMap[this.blockID] = this.data.currentDF
      this.result = this.data.currentDF
      ws.unsubscribe()
    })
    this.submittedQuery = true
    console.log(this.parameters[this.choosenMethod])
    this.ws.imputeData(this.choosenMethod, this.parameters[this.choosenMethod])
  }

  download = this.data.downloadData
}
