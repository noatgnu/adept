import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Experiment} from "../../../classes/settings";
import {DataFrame, IDataFrame} from "data-forge";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-correlation-matrix',
  templateUrl: './correlation-matrix.component.html',
  styleUrls: ['./correlation-matrix.component.css']
})
export class CorrelationMatrixComponent implements OnInit {
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
  result: IDataFrame = new DataFrame()
  submittedQuery: boolean = false;
  methods: string[] = [
    "pearson", "kendall", "spearman"
  ]

  chosenMethod: string = "pearson"
  description: any = {
    "pearson": "standard correlation coefficient",
    "kendall": "Kendall Tau correlation coefficient",
    "spearman": "Spearman rank correlation",
  }
  constructor(public settings: SettingsService, private ws: WebsocketService, private data: DataService) {

  }

  ngOnInit(): void {

  }



  correlationMatrix() {
    this.ws.activeBlock = this.blockID
    const ws = this.ws.ws.subscribe(data => {
      this.submittedQuery = false
      this.data.updateDataState(this.blockID, data["data"])
      this.result = this.data.dfMap[this.blockID]
      ws.unsubscribe()
    })

    this.parameters.emit({chosenMethod: this.chosenMethod})
    this.ws.CorrelationMatrix(this.chosenMethod)
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
