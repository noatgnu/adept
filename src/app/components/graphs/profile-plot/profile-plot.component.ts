import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {DataFrame, IDataFrame} from "data-forge";
import {PlotlyService} from "angular-plotly.js";

@Component({
  selector: 'app-profile-plot',
  templateUrl: './profile-plot.component.html',
  styleUrls: ['./profile-plot.component.css']
})
export class ProfilePlotComponent implements OnInit {

  element: HTMLElement|null|undefined;
  _blockID: number = 0;
  @Input() set blockID (value:number) {
    this._blockID = value
    if (this._blockID !== 0) {
      this.df = this.data.dfMap[this._blockID]
      this.drawData()
    }
  }

  log10Transform: boolean = false;

  result: any[] = []
  layout: any = {height: 450, width:450}
  df: IDataFrame = new DataFrame()
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
          color: "rgba(71,71,71,0.1)"
        }
      }
      for (const c of this.settings.settings.experiments) {

        if (r[c.name] !== null) {
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
            box[c.name].y.push(Math.log10(r[c.name]))
            temp.y.push(Math.log10(r[c.name]))
          } else {
            box[c.name].y.push(r[c.name])
            temp.y.push(r[c.name])
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
