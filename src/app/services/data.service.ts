import { Injectable } from '@angular/core';
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {BehaviorSubject, Subject} from "rxjs";
import {SettingsService} from "./settings.service";
import {MatDialog} from "@angular/material/dialog";
import {ViewDatatableComponent} from "../components/view-datatable/view-datatable.component";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  currentDF: IDataFrame = new DataFrame()
  addPlotBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject<any>({id:0, plotType:""})
  viewDataTableSubject: Subject<IDataFrame> = new Subject<IDataFrame>()
  dfMap: any = {}

  constructor(private settings: SettingsService, private dialog: MatDialog) { }

  downloadData(id: number) {
    console.log(this.dfMap)
    console.log(id)
    console.log(this.dfMap[id])
    const blob = new Blob([this.dfMap[id].toCSV()], {type: 'text/csv'})
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

  viewData(data: IDataFrame){

    const dialofRef = this.dialog.open(ViewDatatableComponent)
    dialofRef.afterOpened().subscribe(result => {
      this.viewDataTableSubject.next(data);
    })
    dialofRef.afterClosed().subscribe(result => {
      console.log("Closed")
    })
  }

  addGraph(id: number, plotType: string) {
    const blockID = id - 1
    let i = this.settings.settings.blocks[blockID].graphs.length
    this.settings.settings.blocks[blockID].graphs.push({id: i+1, name: plotType, parameters: {}, parentBlockID: id})

    this.addPlotBehaviorSubject.next({id:id, plotType:plotType})
  }

  updateDFmap(data: any) {
    this.dfMap = data
    console.log(this.dfMap)
  }
}
