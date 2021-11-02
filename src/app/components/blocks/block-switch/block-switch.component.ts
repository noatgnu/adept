import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Block} from "../../../classes/settings";
import {DataService} from "../../../services/data.service";
import {SettingsService} from "../../../services/settings.service";
import {DataFrame, IDataFrame} from "data-forge";

@Component({
  selector: 'app-block-switch',
  templateUrl: './block-switch.component.html',
  styleUrls: ['./block-switch.component.css']
})
export class BlockSwitchComponent implements OnInit, OnChanges {

  @Input() blockID: number = 0
  block: Block = {id: 0, graphs: [], parameters: {}}
  df: IDataFrame = new DataFrame()
  constructor(private data: DataService, public settings: SettingsService, private cd: ChangeDetectorRef) {


  }

  ngOnInit(): void {
    this.settings.newSettingsLoaded.asObservable().subscribe(trigger => {
      if (trigger) {
        if (this.blockID !== 0) {
          this.df = this.data.dfMap[this.blockID]
          this.cd.detectChanges()
        }
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
  }

  updateParams(e: any) {
    this.settings.settings.blocks[this.blockID-1].parameters = e
  }
}
