import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {DataFrame, IDataFrame} from "data-forge";
import {PlotlyService} from "angular-plotly.js";
import {Graph} from "../../../classes/settings";

@Component({
  selector: 'app-profile-plot',
  templateUrl: './profile-plot.component.html',
  styleUrls: ['./profile-plot.component.css']
})
export class ProfilePlotComponent implements OnInit {

  _blockID: number = 0;
  set blockID (value:number) {
    if(value) {
      this._blockID = value
      if (this._blockID !== 0) {
        this.df = this.data.dfMap[this._blockID]
        this.drawData()
      }
    }

  }

  log10Transform: boolean = false;

  result: any[] = []
  layout: any = {height: 450, width:450}
  df: IDataFrame = new DataFrame()

  _graph: Graph = {id: 0, name: "", parameters: undefined, parentBlockID: 0}

  @Input() set graph(value: Graph) {
    this._graph = value
    this.blockID = this._graph.parentBlockID
  }

  constructor(private data: DataService, private settings: SettingsService, private ws: WebsocketService, private plotly: PlotlyService) {

  }

  drawData() {
    this.result = []
    const box: any = {}
    for (const r of this.df) {
      let primaryIDList = []
      for (const c of this.settings.settings.primaryIDColumns) {
        primaryIDList.push(r[c])
      }
      const primaryID = primaryIDList.join(";")
      const temp: any = {
        x: [],
        y: [],
        mode: "lines",
        name: primaryID,
        showlegend: false,
        line: {
          color: "rgba(71,71,71,0.05)"
        },
      }
      for (const c of this.settings.settings.experiments) {

        if (r[c.name] !== null) {
          const n = parseFloat(r[c.name])
          if (!(c.name in box)) {
            box[c.name] = {
              y: [],
              type: "box",
              name: c.name,
              boxpoints: false,
              marker: {
                color: "black"
              },
              showlegend: false
            }
          }

          if (this.log10Transform) {
            if (n === 0) {
              box[c.name].y.push(0)
              temp.y.push(0)
            } else {
              if (n > 0) {
                box[c.name].y.push(Math.log10(n))
                temp.y.push(Math.log10(n))
              } else {
                box[c.name].y.push(-Math.log10(Math.abs(n)))
                temp.y.push(-Math.log10(Math.abs(n)))
              }
            }
          } else {
            box[c.name].y.push(n)
            temp.y.push(n)
          }
          temp.x.push(c.name)
        }
      }
      this.result.push(temp)
    }
    for (const c in box) {
      this.result.push(box[c])
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
