import {Component, Input, OnInit} from '@angular/core';
import {DataFrame, IDataFrame} from "data-forge";
import {DataService} from "../../../services/data.service";
import {SettingsService} from "../../../services/settings.service";
import {WebsocketService} from "../../../services/websocket.service";

@Component({
  selector: 'app-box-plot',
  templateUrl: './box-plot.component.html',
  styleUrls: ['./box-plot.component.css']
})
export class BoxPlotComponent implements OnInit {


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
  layout: any = {}
  df: IDataFrame = new DataFrame()
  constructor(private data: DataService, private settings: SettingsService, private ws: WebsocketService) {

  }

  drawData() {
    this.result = []
    for (const r of this.df) {
      let primaryIDList = []
      for (const c of this.settings.settings.primaryIDColumns) {
        primaryIDList.push(r[c])
      }
      const primaryID = primaryIDList.join(";")
      const temp: any = {
        x: [],
        y: [],
        type: 'box',
        name: primaryID,
        showlegend: false
      }
      for (const c of this.settings.settings.experiments) {
        if (r[c.name] !== null) {
          if (this.log10Transform) {
            temp.x.push(Math.log10(r[c.name]))
          } else {
            temp.x.push(r[c.name])
          }
          temp.y.push(c.name)
        }
      }
    }
  }

  ngOnInit(): void {
  }

  allReady() {

  }

  download() {

  }

}
