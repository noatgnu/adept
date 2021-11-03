import { Injectable } from '@angular/core';
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {BehaviorSubject, Subject} from "rxjs";
import {SettingsService} from "./settings.service";
import {MatDialog} from "@angular/material/dialog";
import {ViewDatatableComponent} from "../components/view-datatable/view-datatable.component";
import {BlockDeletePromptComponent} from "../components/block-delete-prompt/block-delete-prompt.component";
import {WebsocketService} from "./websocket.service";
import {Block, Graph} from "../classes/settings";
import {GraphDeletePromptComponent} from "../components/graph-delete-prompt/graph-delete-prompt.component";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  currentDF: IDataFrame = new DataFrame()
  addPlotBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject<any>({id:0, plotType:""})
  viewDataTableSubject: Subject<IDataFrame> = new Subject<IDataFrame>()
  dfMap: any = {}

  constructor(private settings: SettingsService, private dialog: MatDialog, private ws: WebsocketService) { }

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

  deleteBlock(id: number) {
    const dialogRef = this.dialog.open(BlockDeletePromptComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.settings.settings.blocks[id-1].completed) {
          this.ws.DeleteNode(id)
        }

        const blocks: Block[] = []
        let lastID: number = 0
        for (const b of this.settings.settings.blocks) {
          lastID = b.id
          if (b.id < id) {
            blocks.push(b)
          } else if (b.id > id) {
            b.id = b.id - 1
            if (this.dfMap[b.id+1]) {
              this.dfMap[b.id] = this.dfMap[b.id+1]
            }
            for (const g of b.graphs) {
              g.parentBlockID = b.id
            }
            b.completed = false
            blocks.push(b)
          } else {

          }
        }
        this.dfMap[lastID] = null
        this.settings.settings.blocks = blocks
        console.log("Deleting block " + id)
      }

    })
  }

  deleteGraph(graph: Graph) {
    const dialogRef = this.dialog.open(GraphDeletePromptComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const b = this.settings.settings.blocks[graph.parentBlockID-1]
        const graphs: Graph[] = []
        let lastID: number = 0
        for (const g of b.graphs) {
          lastID = g.id
          if (graph.id > g.id) {
            graphs.push(g)
          } else if (graph.id < g.id) {
            g.id = g.id - 1
            graphs.push(g)
          }
        }
        this.settings.settings.blocks[graph.parentBlockID-1].graphs = graphs
      }

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
