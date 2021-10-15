import { Injectable } from '@angular/core';
import {DataFrame, IDataFrame} from "data-forge";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  currentDF: IDataFrame = new DataFrame()
  addPlotBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject<any>({id:0, plotType:""})
  dfMap: any = {}

  constructor() { }
}
