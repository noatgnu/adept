import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from "../../services/websocket.service";
import {SettingsService} from "../../services/settings.service";
import {DataService} from "../../services/data.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {ExportData} from "../../classes/settings";
import {fromJSON} from "data-forge";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  opened: boolean = true

  routeSub: Subscription = new Subscription()
  constructor(private ws: WebsocketService, public settings: SettingsService, private data: DataService, private snack: MatSnackBar, private route: ActivatedRoute) {
    const a = this.ws.ws.subscribe(data => {
      a.unsubscribe()
      this.routeSub = this.route.params.subscribe(params => {
        if (params) {
          if (params["settings"]) {
            const ws = this.ws.ws.subscribe(data => {
              if (data["data"]) {
                const jsonData: ExportData = JSON.parse(data["data"]);
                for (const l in jsonData.data) {
                  jsonData.data[l] = fromJSON(jsonData.data[l])
                }
                this.data.updateDFmap(jsonData.data)
                this.settings.settings = jsonData.settings
                this.settings.settings.uniqueID = data["id"]
                this.settings.settingsUpdated()
              }
              ws.unsubscribe()
            })
            this.ws.LoadSaved(params["settings"])
          }
        }
      })
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
      this.snack.open("Server backend link has been updated: " + this.ws.baseUrl, "", {duration: 5000})
    }
  }

  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    this.routeSub.unsubscribe()
    this.ws.EndSession()
  }

  openCurtainUploader() {
    this.data.viewCurtainUploader()
  }

  ngOnInit() {

  }
}
