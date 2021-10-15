import {Component, Input, OnInit} from '@angular/core';
import {SettingsService} from "../../services/settings.service";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-add-graph-button',
  templateUrl: './add-graph-button.component.html',
  styleUrls: ['./add-graph-button.component.css']
})
export class AddGraphButtonComponent implements OnInit {
  @Input() id: number = 0;
  constructor(public settings: SettingsService, private data: DataService) { }

  ngOnInit(): void {
  }

  addPlot(plotName: string) {
    this.data.addPlotBehaviorSubject.next({id: this.id, plotType: plotName})
  }
}
