import {Component, Input, OnInit} from '@angular/core';
import {DataFrame, IDataFrame} from "data-forge";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-fuzzy',
  templateUrl: './fuzzy.component.html',
  styleUrls: ['./fuzzy.component.css']
})
export class FuzzyComponent implements OnInit {
  _blockID: number = 0
  @Input() set blockID(value: number) {
    this._blockID = value
  }
  get blockID(): number {
    return this._blockID
  }

  membershipThreshold = 0


  submittedQuery = false


  result: IDataFrame = new DataFrame()
  constructor(public settings: SettingsService, private ws: WebsocketService, private data: DataService) { }

  ngOnInit(): void {
  }


  fuzzyClusterData() {
    const ws = this.ws.ws.subscribe(data => {
      this.submittedQuery = false
      this.data.updateDataState(this.blockID, data["data"])
      this.result = this.data.currentDF
      ws.unsubscribe()
    })
    this.submittedQuery = true
    this.ws.fuzzyClusterData(this.membershipThreshold)
  }

  download = this.data.downloadData

}
