import {Component, Input, OnInit} from '@angular/core';
import {Block} from "../../../classes/settings";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-block-switch',
  templateUrl: './block-switch.component.html',
  styleUrls: ['./block-switch.component.css']
})
export class BlockSwitchComponent implements OnInit {
  @Input() block: Block = {id: 0}
  graphs: any = []
  constructor(private data: DataService) {
    this.data.addPlotBehaviorSubject.subscribe(data => {
      if (data.plotType !== "") {
        if (data.id === this.block.id) {
          this.graphs.push(data.plotType)
        }
      }
    })
  }

  ngOnInit(): void {

  }

}
