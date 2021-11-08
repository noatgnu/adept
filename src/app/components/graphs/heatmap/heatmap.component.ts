import {Component, Input, OnInit} from '@angular/core';
import {Graph} from "../../../classes/settings";
import {DataFrame, IDataFrame} from "data-forge";
import {DataService} from "../../../services/data.service";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {PlotlyService} from "angular-plotly.js";

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit {
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
        this.log10Transform = this._graph.parameters.log10Transform
      }

    }
  }

  df: IDataFrame = new DataFrame()
  log10Transform: boolean = false;

  result: any[] = []
  layout: any = {height: 450, width:450,
    xaxis: {
      tickangle: 90,
      tickmode: "array",
      tickvals: [],
      ticktext: [],
    },
    yaxis: {
      tickmode: "array",
      tickvals: [],
      ticktext: [],
    }
  }

  showAllTicks: boolean = false
  constructor(private data: DataService, private settings: SettingsService, private ws: WebsocketService, private plotly: PlotlyService) { }

  ngOnInit(): void {
  }

  clusters: string[] = []

  dataFuzzy: any = {}
  drawData() {
    let layout: any


    if (this.showAllTicks) {
      layout = {height: 450, width:450,
        xaxis: {
          tickangle: 90,
          tickmode: "array",
          tickvals: [],
          ticktext: [],
        },
        yaxis: {
          tickmode: "array",
          tickvals: [],
          ticktext: [],
        }
      }
    } else {
      layout = {height: 450, width:450,
        xaxis: {
          tickangle: 90,
          tickmode: "category",
          showticklabels: true
        },
        yaxis: {
          tickmode: "category",
          showticklabels: true
        }
      }
    }

    this.result = []
    this.dataFuzzy = {}
    const experiments: string[] = []
    for (const e of this.settings.settings.experiments) {
      experiments.push(e.name)
    }

    this.clusters = this.df.getSeries("Cluster").distinct().bake().toArray()
    const temp: any = {
      z: [],
      x: [],
      y: [],
      type: 'heatmap',
    }
    console.log(experiments)
    for (const c of this.df.getColumnNames()) {
      console.log(c)
      if (experiments.includes(c)) {
        temp.x.push(c)
        if (this.showAllTicks) {
          layout.xaxis.tickvals.push(c)
          layout.xaxis.ticktext.push(c)
        }

      }
    }

    for (const r of this.df) {

      if (this.settings.settings.blocks[this._graph.parentBlockID-1].title === "Correlation Matrix") {
        temp.y.push(r[""])
        if (this.showAllTicks) {
          layout.yaxis.tickvals.push(r[""])
          layout.yaxis.ticktext.push(r[""])
        }
      } else {
        let primaryIDList = []
        for (const c of this.settings.settings.primaryIDColumns) {
          primaryIDList.push(r[c])
        }
        const primaryID = primaryIDList.join(";")
        temp.y.push(primaryID)
        if (this.showAllTicks) {
          layout.yaxis.tickvals.push(primaryID)
          layout.yaxis.ticktext.push(primaryID)
        }
      }

      const arr: any[] = []
      for (const c of temp.x) {
        if (r[c] !== "") {
          const n = parseFloat(r[c])
          if (this.log10Transform) {
            if (n === 0) {
              arr.push(0)
            } else {
              if (n > 0) {
                arr.push(Math.log10(n))
              } else {
                arr.push(-Math.log10(Math.abs(n)))
              }
            }
          } else {
            arr.push(n)
          }
        } else {
          arr.push(null)
        }
      }
      temp.z.push(arr)
    }
    console.log(temp)
    this.layout = layout
    this.result = [temp]
  }

  async download(format: string = "svg") {
    const graph = this.plotly.getInstanceByDivId(this._blockID + "heatmap");
    const p = await this.plotly.getPlotly();
    await p.downloadImage(graph, {format: format, filename: "image"})
  }

  delete() {
    this.data.deleteGraph(this._graph)
  }
}
