import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {PlotlyService} from "angular-plotly.js";
import {DataFrame, IDataFrame} from "data-forge";
import {Graph} from "../../../classes/settings";

@Component({
  selector: 'app-fuzzy-plot',
  templateUrl: './fuzzy-plot.component.html',
  styleUrls: ['./fuzzy-plot.component.css']
})
export class FuzzyPlotComponent implements OnInit {
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

  _graph: Graph = {id: 0, name: "", parameters: undefined, parentBlockID: 0}

  @Input() set graph(value: Graph) {
    this._graph = value
    if (this._graph.id !== 0) {
      this.blockID = this._graph.parentBlockID
      if (Object.keys(this._graph.parameters).length > 0) {
        this.selectedCluster = this._graph.parameters.selectedCluster
        this.log10Transform = this._graph.parameters.log10Transform
      }

    }
  }

  df: IDataFrame = new DataFrame()
  log10Transform: boolean = false;

  result: any[] = []
  layout: any = {height: 450, width:450}

  selectedCluster: string = ""
  constructor(private data: DataService, private settings: SettingsService, private ws: WebsocketService, private plotly: PlotlyService) { }

  ngOnInit(): void {
  }

  clusters: string[] = []

  dataFuzzy: any = {}
  drawData() {
    this.result = []
    this.dataFuzzy = {}
    const conditions: string[] = []
    for (const e of this.settings.settings.experiments) {
      if (!(conditions.includes(e.condition))) {
        conditions.push(e.condition)
      }
    }
    this.clusters = this.df.getSeries("Cluster").distinct().bake().toArray()
    if (this.selectedCluster === "") {
      this.selectedCluster = this.clusters[0]
    }

    for (const r of this.df) {

      if (!(r.Cluster in this.dataFuzzy)) {
        this.dataFuzzy[r.Cluster] = []
      }
      const names = []
      for (const p of this.settings.settings.primaryIDColumns) {
        names.push(r[p])
      }
      const temp: any = {
        x: [],
        y: [],
        mode: "lines",
        name: names.join(";"),
        showlegend: false,

        line: {
          color: `rgb(148, 112, 112,${r[r.Cluster]})`
        },
      }
      for (const c of conditions) {
        const n = parseFloat(r[c])
        temp.x.push(c)
        if (this.log10Transform) {
          if (n === 0) {
            temp.y.push(0)
          } else {
            if (n > 0) {
              temp.y.push(Math.log10(n))
            } else {
              temp.y.push(-Math.log10(Math.abs(n)))
            }
          }
        } else {
          temp.y.push(n)
        }
      }


      this.dataFuzzy[r.Cluster].push(temp)
    }
    this.result = this.dataFuzzy[this.selectedCluster]
    console.log(this.result)
  }

  async download(format: string = "svg") {
    const graph = this.plotly.getInstanceByDivId(this._blockID + "profile_plot");
    const p = await this.plotly.getPlotly();
    await p.downloadImage(graph, {format: format, filename: "image"})
  }

  selectCluster() {
    this.result = [...this.dataFuzzy[this.selectedCluster]]
    console.log(this.result)
  }
}
