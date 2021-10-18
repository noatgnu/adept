import {Component, Input, OnInit} from '@angular/core';
import {Experiment} from "../../../classes/settings";
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-p-correction',
  templateUrl: './p-correction.component.html',
  styleUrls: ['./p-correction.component.css']
})
export class PCorrectionComponent implements OnInit {
  _blockID: number = 0
  @Input() set blockID(value: number) {
    this._blockID = value
  }
  get blockID(): number {
    return this._blockID
  }
  pCutOff: number = 0.05
  result: IDataFrame = new DataFrame()
  submittedQuery: boolean = false;
  constructor(public settings: SettingsService, private ws: WebsocketService, private data: DataService) {

  }

  ngOnInit(): void {

  }



  correctData() {
    const ws = this.ws.ws.subscribe(data => {
      this.submittedQuery = false
      this.settings.settings.blockMap[this.blockID].completed = true
      this.data.dfMap[this.blockID] = fromCSV(<string>data["data"])
      this.data.currentDF = this.data.dfMap[this.blockID]
      this.result = this.data.dfMap[this.blockID]
      ws.unsubscribe()
    })
    this.ws.correctData(this.pCutOff)
    this.submittedQuery = true
  }

  download = this.data.downloadData

}
