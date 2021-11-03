import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Output() parameters: EventEmitter<any> = new EventEmitter<any>()
  _blockID: number = 0
  @Input() set blockID(value: number) {
    this._blockID = value
    if (Object.keys(this.settings.settings.blocks[this._blockID-1].parameters).length > 0) {
      this.chosenMethod = this.settings.settings.blocks[this._blockID-1].parameters.chosenMethod
      this.pCutOff = this.settings.settings.blocks[this._blockID-1].parameters.pCutOff
    }

  }
  get blockID(): number {
    return this._blockID
  }
  pCutOff: number = 0.05
  result: IDataFrame = new DataFrame()
  submittedQuery: boolean = false;
  methods: string[] = [
    "bonferonni", "sidak", "holm-sidak", "holm", "simes-hochberg", "hommel", "fdr_bh", "fdr_by", "fdr_tsbh", "fdr_tsbky"
  ]
  chosenMethod: string = "fdr_bh"
  description: any = {
    "bonferonni": "one-step correction",
    "sidak": "one-step correction",
    "holm-sidak": "step down method using Sidak adjustments",
    "holm": "step-down method using Bonferroni adjustments",
    "simes-hochberg": "step-up method  (independent)",
    "hommel": "closed method based on Simes tests (non-negative)",
    "fdr_bh": "Benjamini/Hochberg (non-negative)",
    "fdr_by": "Benjamini/Yekutieli (negative)",
    "fdr_tsbh": "two stage fdr correction (non-negative)",
    "fdr_tsbky": "two stage fdr correction (non-negative)"
  }
  constructor(public settings: SettingsService, private ws: WebsocketService, private data: DataService) {

  }

  ngOnInit(): void {

  }



  correctData() {
    const ws = this.ws.ws.subscribe(data => {
      this.submittedQuery = false
      this.data.updateDataState(this.blockID, data["data"])
      this.result = this.data.dfMap[this.blockID]
      ws.unsubscribe()
    })

    this.parameters.emit({chosenMethod: this.chosenMethod, pCutOff: this.pCutOff})
    this.ws.correctData(this.chosenMethod, this.pCutOff)
    this.submittedQuery = true
  }

  download() {
    this.data.downloadData(this.blockID)
  }

  updateParameters() {
    this.data.updateParametersSubject.next({id: this.blockID, data: {pCutOff: this.pCutOff}, origin: this.blockID})
  }
  delete() {
    this.data.deleteBlock(this._blockID)
  }
  ViewInputData() {
    this.data.viewData(this.data.dfMap[this._blockID - 1].head(10).bake())
  }
}
