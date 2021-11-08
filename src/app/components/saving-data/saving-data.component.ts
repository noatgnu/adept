import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingsService} from "../../services/settings.service";
import {DataService} from "../../services/data.service";
import {WebsocketService} from "../../services/websocket.service";
import {ExportData} from "../../classes/settings";

@Component({
  selector: 'app-saving-data',
  templateUrl: './saving-data.component.html',
  styleUrls: ['./saving-data.component.css']
})
export class SavingDataComponent implements OnInit, OnDestroy {

  constructor(private settings: SettingsService, private data: DataService, private ws: WebsocketService) { }

  ngOnInit(): void {
  }
  saveServer: boolean = false

  saveSettings() {
    this.settings.saveSettings(this.data.dfMap)
    const settings: ExportData = {settings: this.settings.settings, data: this.data.dfMap}
    const ws = this.ws.ws.subscribe(data => {
      console.log(data)
      ws.unsubscribe()
    })
    this.ws.SaveAnalysis(JSON.stringify(settings))

  }

  ngOnDestroy() {

  }
}
