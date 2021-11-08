import { Component, OnInit } from '@angular/core';
import {SettingsService} from "../../services/settings.service";
import {Block, CurtainSettings} from "../../classes/settings";
import {DataFrame, IDataFrame, Series} from "data-forge";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-curtain-uploader',
  templateUrl: './curtain-uploader.component.html',
  styleUrls: ['./curtain-uploader.component.css']
})
export class CurtainUploaderComponent implements OnInit {
  password = ""

  curtainData: any = {raw: "", processed: "", settings: "", password: this.password}
  raw: Block = {graphs: [], id: 0, parameters: undefined}
  processed: Block = {graphs: [], id: 0, parameters: undefined}

  constructor(public settings: SettingsService, private data: DataService) {
    this.settings.curtainSettings.fileSavedOnSever = true
    this.settings.curtainSettings.dataColumns.rawIdentifierCol = "Primary IDs"
    this.settings.curtainSettings.dataColumns.processedIdentifierCol = "Primary IDs"
    this.settings.curtainSettings.dataColumns.rawSamplesCol = []
    for (const e of this.settings.settings.experiments) {
      this.settings.curtainSettings.dataColumns.rawSamplesCol.push(e.name)
    }
    this.settings.curtainSettings.dataColumns.processedLog2FC = "log2FC"
    this.settings.curtainSettings.dataColumns.processedCompLabel = "Comparison"
  }

  reformat(raw: boolean) {
    let df: IDataFrame
    if (raw) {
      df = this.data.dfMap[this.raw.id]
    } else {
      df = this.data.dfMap[this.processed.id]
      if (df.getColumnNames().includes("adj.p-value")) {
        this.settings.curtainSettings.dataColumns.processedPValue = "adj.p-value"
      } else {
        this.settings.curtainSettings.dataColumns.processedPValue = "p-value"
      }
    }
    const primaryIDs = []
    for (const r of df) {
      const primaryIDList: string[] = []
      for (const c of this.settings.settings.primaryIDColumns) {
        if (r[c]) {
          primaryIDList.push(r[c])
        }
      }
      primaryIDs.push(primaryIDList.join(";"))
    }
    if (raw) {
      this.curtainData.raw = df.withSeries("Primary IDs", new Series(primaryIDs)).toCSV()
    } else {
      this.curtainData.processed = df.withSeries("Primary IDs", new Series(primaryIDs)).toCSV()
    }

  }

  ngOnInit(): void {
  }


}
