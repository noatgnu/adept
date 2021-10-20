import { Injectable } from '@angular/core';
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {BehaviorSubject, Subject} from "rxjs";
import {SettingsService} from "./settings.service";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  currentDF: IDataFrame = new DataFrame()
  addPlotBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject<any>({id:0, plotType:""})
  dfMap: any = {}

  constructor(private settings: SettingsService) { }

  downloadData(data: string) {
    const blob = new Blob([data], {type: 'text/csv'})
    const url = window.URL.createObjectURL(blob);

    if (typeof(navigator.msSaveOrOpenBlob)==="function") {
      navigator.msSaveBlob(blob, "data.csv")
    } else {
      const a = document.createElement("a")
      a.href = url
      a.download = "data.csv"
      document.body.appendChild(a)
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url)
  }

  updateParametersSubject: Subject<any> = new Subject<any>()

  updateDataState(id: number, rawData: string) {
    this.settings.settings.blockMap[id].completed = true
    this.dfMap[id] = fromCSV(<string>rawData)
    this.currentDF = this.dfMap[id]
    this.updateParametersSubject.next({id: id, origin: id})
    console.log(this.currentDF)
  }
}
