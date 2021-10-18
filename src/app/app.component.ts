import { Component } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {WebsocketService} from "./services/websocket.service";
import {SettingsService} from "./services/settings.service";
import {Block} from "./classes/settings";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'adept';

  opened: boolean = true
  constructor(private ws: WebsocketService, public settings: SettingsService) {
    this.ws.ws.subscribe(data => {
      console.log(data)
    })
    this.settings.settings.blockMap[1] = {completed: false}
    this.settings.settings.blocks = [{id: 1, title: "Starting Data", active: true, completed: false}]
  }

  addBlock(blockTitle: string) {
    const lastBlock = this.settings.settings.blocks[this.settings.settings.blocks.length-1]
    const lastId = lastBlock.id
    lastBlock.active = false
    const block = {id: lastId+1, title: blockTitle, active: true, completed: false}
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


}
