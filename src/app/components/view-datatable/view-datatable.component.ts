import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../services/data.service";
import {DataFrame, IDataFrame} from "data-forge";
import {MatTable} from "@angular/material/table";
import {isNumber} from "data-forge/build/lib/utils";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-view-datatable',
  templateUrl: './view-datatable.component.html',
  styleUrls: ['./view-datatable.component.css']
})
export class ViewDatatableComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) table: MatTable<any>|undefined;
  df: any[] = []
  sampleCols: string[] = []
  sub: Subscription;
  constructor(private data: DataService) {
    this.sub = this.data.viewDataTableSubject.asObservable().subscribe(df => {
      this.df = []
      if (df.count() > 0) {
        this.df = df.toArray()
        this.sampleCols = df.getColumnNames()
        console.log(this.df)
        this.table?.renderRows()
      }
    })
  }

  ngOnInit(): void {

  }

  convertToNumb(data: any) {
    if (data) {
      const a = Number(data)
      if (a) {
        return a.toFixed(2)
      } else {
        return data
      }
    } else {
      return data
    }

  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}
