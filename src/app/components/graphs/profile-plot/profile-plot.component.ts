import { Component, OnInit } from '@angular/core';
import {ChartType, Column} from "angular-google-charts";
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
    this.df = this.data.currentDF
    this.drawData()
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

}
