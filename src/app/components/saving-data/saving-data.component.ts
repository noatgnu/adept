import { Component, OnInit } from '@angular/core';
import {SettingsService} from "../../services/settings.service";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-saving-data',
  templateUrl: './saving-data.component.html',
  styleUrls: ['./saving-data.component.css']
})
export class SavingDataComponent implements OnInit {

  constructor(private settings: SettingsService, private data: DataService) { }

  ngOnInit(): void {
  }

  saveSettings() {
    this.settings.saveSettings(this.data.dfMap)
  }
}
