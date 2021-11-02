import { Injectable } from '@angular/core';
import {ExportData, Settings} from "../classes/settings";
import {MatDialog} from "@angular/material/dialog";
import {SavingDataComponent} from "../components/saving-data/saving-data.component";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settings: Settings = new Settings()
  newSettingsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  constructor(private dialog: MatDialog) { }

  saveSettings(dfMap: any) {
    const settings: ExportData = {settings: this.settings, data: dfMap}
    const blob = new Blob([JSON.stringify(settings)], {type: 'text/csv'})
    const url = window.URL.createObjectURL(blob);

    if (typeof(navigator.msSaveOrOpenBlob)==="function") {
      navigator.msSaveBlob(blob, "data-settings.json")
    } else {
      const a = document.createElement("a")
      a.href = url
      a.download = "data-settings.json"
      document.body.appendChild(a)
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url)
  }

  openSaveSettings() {
    const dialofRef = this.dialog.open(SavingDataComponent)
    dialofRef.afterClosed().subscribe(result => {

    })
  }

  settingsUpdated() {
    this.newSettingsLoaded.next(true)
  }
}
