import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataFrame, IDataFrame} from "data-forge";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {DataService} from "../../../services/data.service";
import {Block} from "../../../classes/settings";

@Component({
  selector: 'app-set-df-as-current',
  templateUrl: './set-df-as-current.component.html',
  styleUrls: ['./set-df-as-current.component.css']
})
export class SetDfAsCurrentComponent implements OnInit {

  @Output() parameters: EventEmitter<any> = new EventEmitter<any>()
  _blockID: number = 0
  @Input() set blockID(value: number) {
    this._blockID = value
    if (Object.keys(this.settings.settings.blocks[this._blockID-1].parameters).length > 0) {
      this.chosenBlockID = this.settings.settings.blocks[this._blockID-1].parameters.chosenBlockID
    }
  }
  get blockID(): number {
    return this._blockID
  }
  pCutOff: number = 0.05
  result: IDataFrame = new DataFrame()
  submittedQuery: boolean = false;
  dataOptions: Block[] = []
  chosenBlockID: number = 0
  constructor(public settings: SettingsService, private ws: WebsocketService, private data: DataService) {
    for (const i of this.settings.settings.blocks) {
      this.dataOptions.push(i)
      if (i.id === this._blockID) {
        break
      }
    }
  }

  ngOnInit(): void {

  }


  changeCurrentDF() {
    if (this.chosenBlockID !== 0) {
      const ws = this.ws.ws.subscribe(data => {
        this.submittedQuery = false
        this.data.updateDataState(this.blockID, data["data"])
        this.result = this.data.dfMap[this.blockID]
        ws.unsubscribe()
      })

      this.parameters.emit({chosenBlockID: this.chosenBlockID})
      this.ws.changeCurrentDF(this.chosenBlockID)
      this.submittedQuery = true
    }

  }

  download() {
    this.data.downloadData(this.blockID)
  }

  ViewInputData() {
    this.data.viewData(this.data.dfMap[this._blockID - 1].head(10).bake())
  }

}
