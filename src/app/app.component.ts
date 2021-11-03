import {Component, HostListener, OnDestroy} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {DataFrame, fromCSV, fromJSON, IDataFrame} from "data-forge";
import {WebsocketService} from "./services/websocket.service";
import {SettingsService} from "./services/settings.service";
import {Block, ExportData} from "./classes/settings";
import {toArray} from "rxjs/operators";
import {DataService} from "./services/data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  title = 'adept';

  opened: boolean = true
  constructor(private ws: WebsocketService, public settings: SettingsService, private data: DataService) {
    const a = this.ws.ws.subscribe(data => {
      console.log(data)
      a.unsubscribe()
    })

    this.settings.settings.blockMap[1] = {completed: false}
    this.settings.settings.blocks = [{id: 1, title: "Starting Data", active: true, completed: false, graphs: [], parameters: {}}]
  }

  addBlock(blockTitle: string) {
    const lastBlock = this.settings.settings.blocks[this.settings.settings.blocks.length-1]
    const lastId = lastBlock.id
    lastBlock.active = false
    const block = {id: lastId+1, title: blockTitle, active: true, completed: false, graphs: [], parameters: {}}
    this.settings.settings.blockMap[lastId+1] = block
    this.settings.settings.blocks.push(block)

  }

  scrollTo(id: number) {
    const block = document.getElementById(id+"-block-switch")
    block?.scrollIntoView()
  }

  toggleSideNav() {
    this.opened = !this.opened
  }

  saveMenu() {
    this.settings.openSaveSettings()
  }

  uploadSettingsData(a: HTMLInputElement) {
    a.click()
  }

  _uploadSettings(e: Event) {
    console.log(e)
    if (e.target) {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const reader = new FileReader()
        reader.onload = (e: any) => {
          const jsonData: ExportData = JSON.parse(<string>reader.result);
          for (const l in jsonData.data) {
            jsonData.data[l] = fromJSON(jsonData.data[l])
          }
          this.data.updateDFmap(jsonData.data)
          this.settings.settings = jsonData.settings


          this.settings.settingsUpdated()
        }
        reader.readAsText(target.files[0])
      }
    }

  }

  updateServerURL(e: KeyboardEvent, url: string) {
    if (e.key === "Enter") {
      this.ws.updateBaseUrl(url)
    }
  }
  @HostListener('window:beforeunload')
  async ngOnDestroy() {

  }
}
