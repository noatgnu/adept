import {Component, Input, OnInit} from '@angular/core';
import {DataFrame, IDataFrame} from "data-forge";
import {DataService} from "../../../services/data.service";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {PlotlyService} from "angular-plotly.js";
import {Graph} from "../../../classes/settings";

@Component({
  selector: 'app-pca-plot',
  templateUrl: './pca-plot.component.html',
  styleUrls: ['./pca-plot.component.css']
})
export class PCAPlotComponent implements OnInit {

  _blockID: number = 0;
  set blockID (value:number) {
    if (value) {
      this._blockID = value
      if (this._blockID !== 0) {
        this.df = this.data.dfMap[this._blockID]
        this.drawData()
      }
    }

  }

  _graph: Graph = {id: 0, name: "", parameters: undefined, parentBlockID: 0}

  @Input() set graph(value: Graph) {
    this._graph = value
    if (this._graph.id !== 0) {
      this.blockID = this._graph.parentBlockID
      if (Object.keys(this._graph.parameters).length > 0) {
        this.log10Transform = this._graph.parameters.log10Transform
      }

    }
  }

  df: IDataFrame = new DataFrame()
  log10Transform: boolean = false;

  result: any[] = []
  layout: any = {height: 450, width:450}

  constructor(private data: DataService, private settings: SettingsService, private ws: WebsocketService, private plotly: PlotlyService) { }

  ngOnInit(): void {
  }

  drawData() {
    this.result = []
    const dataPCA: any = {}
    for (const r of this.df) {
      if (!(r.Cluster in dataPCA)) {
        dataPCA[r.Cluster] = {
          x: [],
          y: [],
          type: "scatter",
          mode: "markers",
          name: r.Cluster,
          showlegend: true,
        }
      }
      dataPCA[r.Cluster].x.push(r.PC1)
      dataPCA[r.Cluster].y.push(r.PC2)
    }
    for (const r in dataPCA) {
      this.result.push(dataPCA[r])
    }
  }

  async download(format: string = "svg") {
    const graph = this.plotly.getInstanceByDivId(this._blockID + "profile_plot");
    const p = await this.plotly.getPlotly();
    await p.downloadImage(graph, {format: format, filename: "image"})
  }

}
