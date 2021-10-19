import {Component, Input, OnInit} from '@angular/core';
import {DataFrame, IDataFrame} from "data-forge";
import {DataService} from "../../../services/data.service";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {PlotlyService} from "angular-plotly.js";

@Component({
  selector: 'app-volcano-plot',
  templateUrl: './volcano-plot.component.html',
  styleUrls: ['./volcano-plot.component.css']
})
export class VolcanoPlotComponent implements OnInit {

  _blockID: number = 0;
  @Input() set blockID (value:number) {
    this._blockID = value
    if (this._blockID !== 0) {
      this.df = this.data.dfMap[this._blockID]
      const comparisons = this.df.getSeries("Comparison").bake().toArray()
      for (const c of comparisons) {
        if (!this.comparisons.includes(c)) {
          this.comparisons.push(c)
        }
      }
      this.chosenComparison = this.comparisons[0]
      this.drawData()
    }
  }

  get blockID(): number {
    return this._blockID
  }

  result: any[] = []
  layout: any = {height: 400, width:400}
  df: IDataFrame = new DataFrame()
  pCutOff: number = 0.05
  comparisons: string[] = []
  chosenComparison: string = ""
  constructor(private data: DataService, private settings: SettingsService, private ws: WebsocketService, private plotly: PlotlyService) {
    this.data.updateParametersSubject.asObservable().subscribe(data => {
      if (data["id"] === this.blockID && data["id"] === data["origin"]) {
        if ("pCutoff" in data["data"]) {
          this.pCutOff = data["pCutoff"]
          this.drawData()
        }
      }
    })
  }

  drawData() {
    this.result = []
    const temp: any = {}
    for (const r of this.df.where(row => row["Comparison"] === this.chosenComparison).bake()) {
      let primaryIDList = []
      for (const c of this.settings.settings.primaryIDColumns) {
        primaryIDList.push(r[c])
      }
      const primaryID = primaryIDList.join(";")
      let pColumn = "p-value"
      if (this.df.getColumnNames().includes("adj.p-value")) {
        pColumn = "adj.p-value"
      }
      let pValue = undefined
      if (r[pColumn] !== null) {
        pValue = parseFloat(r[pColumn])
      }
      let FC = undefined
      if (r["log2FC"] !== null) {
        FC = parseFloat(r["log2FC"])
      }

      if (pValue && FC) {
        if (pValue > this.pCutOff) {
          if (!("> p-threshold" in temp)) {
            temp["> p-threshold"] = {
              x: [],
              y: [],
              text: [],
              type: "scatter",
              mode: "markers",
              name: "> p-threshold"
            }
          }
          temp["> p-threshold"].x.push(FC)
          temp["> p-threshold"].y.push(-Math.log10(pValue))
          temp["> p-threshold"].text.push(primaryID)
        } else {
          if (!("=< p-threshold" in temp)) {
            temp["=< p-threshold"] = {
              x: [],
              y: [],
              text: [],
              type: "scatter",
              mode: "markers",
              name: "=< p-threshold"
            }
          }
          temp["=< p-threshold"].x.push(FC)
          temp["=< p-threshold"].y.push(-Math.log10(pValue))
          temp["=< p-threshold"].text.push(primaryID)
        }
      }
    }
    for (const t in temp) {
      this.result.push(temp[t])
    }

  }

  ngOnInit(): void {
  }

  async download(format: string = "svg") {
    const graph = this.plotly.getInstanceByDivId(this._blockID + "profile_plot");
    const p = await this.plotly.getPlotly();
    await p.downloadImage(graph, {format: format, filename: "image"})
  }

}
