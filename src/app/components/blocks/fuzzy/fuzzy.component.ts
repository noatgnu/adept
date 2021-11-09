import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Output() parameters: EventEmitter<any> = new EventEmitter<any>()
  _blockID: number = 0

  @Input() set blockID(value: number) {
    this._blockID = value
    if (Object.keys(this.settings.settings.blocks[this._blockID-1].parameters).length > 0) {
      this.membershipThreshold = this.settings.settings.blocks[this._blockID-1].parameters.membershipThreshold
    }

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
    if (!this.ws.lock) {
      this.ws.activeBlock = this.blockID
      const ws = this.ws.ws.subscribe(data => {
        this.submittedQuery = false
        this.data.updateDataState(this.blockID, data["data"])
        this.result = this.data.currentDF
        this.ws.lock = false
        ws.unsubscribe()
      })
      this.ws.lock = true
      this.submittedQuery = true
      this.parameters.emit({membershipThreshold: this.membershipThreshold})
      this.ws.fuzzyClusterData(this.membershipThreshold)
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
