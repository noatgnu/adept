import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ChartBase, ChartEditorComponent, ChartType, Column} from "angular-google-charts";
import {DataService} from "../../../services/data.service";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";
import {DataFrame, IDataFrame} from "data-forge";

@Component({
  selector: 'app-profile-plot',
  templateUrl: './profile-plot.component.html',
  styleUrls: ['./profile-plot.component.css']
})
export class ProfilePlotComponent implements OnInit {
  @ViewChild(ChartEditorComponent)
  public readonly editor: ChartEditorComponent| undefined;

  public editChart(chart: ChartBase) {
    if (this.editor) {
      this.editor
        .editChart(chart)
        .afterClosed()
        .subscribe(result => {
          if (result) {
            console.log(result)
            // Saved
          } else {
            // Cancelled
          }
        });
    }
  }
  element: HTMLElement|null|undefined;
  _blockId: number = 0;
  @Input() set blockId (value:number) {
    this._blockId = value
    if (this._blockId !== 0) {
      this.df = this.data.dfMap[this._blockId]
      this.drawData()
    }
  }

  log10Transform: boolean = false;
  chartType = ChartType.LineChart
  result: any[] = []
  chartColumns: Column[] = [{label: "Samples", type: "string"}]
  options: any = {
    legend:{position:'none'},
    hAxis: {
      showTextEvery: 1,
      slantedText: true,
      slantedTextAngle: 90
    },
  }
  df: IDataFrame = new DataFrame()
  constructor(private data: DataService, private settings: SettingsService, private ws: WebsocketService) {

  }

  drawData() {
    this.result = []
    this.chartColumns = [{label: "Samples", type: "string"}]
    for (let i = 0; i < this.df.count(); i ++) {
      this.chartColumns.push({type: 'number'})
    }

    for (let i = 0; this.settings.settings.experiments.length > i; i ++) {
      if (this.result.length < i+1) {
        this.result.push([this.settings.settings.experiments[i].name])
      }
      for (const b of this.df.getSeries(this.settings.settings.experiments[i].name).bake().toArray()) {
        if (b !== "") {
          if (this.log10Transform) {
            this.result[i].push(Math.log10(parseFloat(b)))
          } else {
            this.result[i].push(parseFloat(b))
          }
        } else {
          this.result[i].push(null)
        }
      }
    }
  }

  ngOnInit(): void {
  }

  allReady() {
    this.element = document.getElementById(this._blockId+"profile_plot")
  }

  download() {
    if (this.element) {
      const svgElement = this.element.getElementsByTagName('svg')[0]
      svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const svgData = svgElement.outerHTML;
      const preface = '<?xml version="1.0" standalone="no"?>\r\n';

      const b = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"})
      var svgUrl = URL.createObjectURL(b);
      var downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = "profilePlot.svg";
      downloadLink.click();
    }
  }
}
