import { Injectable } from '@angular/core';
import {Settings} from "../classes/settings";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settings: Settings = new Settings()
  constructor() { }
}
