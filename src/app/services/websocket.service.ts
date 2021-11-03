import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {Settings} from "../classes/settings";
import {SettingsService} from "./settings.service";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  get serverURL(): string {
    return this._serverURL;
  }

  set serverURL(value: string) {
    this._serverURL = value;
    this.baseUrl = "ws://" + this._serverURL + "/rpc"
  }
  private _serverURL: string = "localhost:8000"
  baseUrl: string = "ws://localhost:8000/rpc"
  private messsageEvent: Subject<MessageEvent> = new Subject<MessageEvent>();
  ws: WebSocketSubject<WebSocketMessageEvent>;
  constructor(private settings: SettingsService) {
    this.ws = webSocket(this.baseUrl);
    this.ws.subscribe()
  }

  requestID() {
    this.ws.next(new WebSocketMessageEvent("request-id"))
  }

  sendStarter(data: string) {
    this.ws.next(new WebSocketMessageEvent( "upload-starter",  data, "", JSON.stringify(this.settings.settings), this.settings.settings.uniqueID))
  }

  imputeData(method: string, parameters: any) {

    this.ws.next(new WebSocketMessageEvent(method, JSON.stringify(parameters), "",  JSON.stringify(this.settings.settings), this.settings.settings.uniqueID))
  }

  normalizeData(method: string) {
    this.ws.next(new WebSocketMessageEvent("Normalization", method, "",  JSON.stringify(this.settings.settings), this.settings.settings.uniqueID))
  }

  ttestData(comparisons: any[]) {
    this.ws.next(new WebSocketMessageEvent("TTest", JSON.stringify(comparisons), "",  JSON.stringify(this.settings.settings), this.settings.settings.uniqueID))
  }

  correctData(method: string, cutoff: number) {
    this.ws.next(new WebSocketMessageEvent(method, cutoff.toString(), "",  JSON.stringify(this.settings.settings), this.settings.settings.uniqueID))
  }

  anova(conditions: string[]) {
    this.ws.next(new WebSocketMessageEvent("ANOVA", JSON.stringify(conditions), "",  JSON.stringify(this.settings.settings), this.settings.settings.uniqueID))
  }

  filterData(filterSteps: any) {
    this.ws.next(new WebSocketMessageEvent("Filter", JSON.stringify(filterSteps), "",  JSON.stringify(this.settings.settings), this.settings.settings.uniqueID))
  }

  fuzzyClusterData(threshold: number) {
    this.ws.next(new WebSocketMessageEvent("Fuzzy", threshold.toString(), "",  JSON.stringify(this.settings.settings), this.settings.settings.uniqueID))
  }

  updateBaseUrl(url: string) {
    this.serverURL = url
  }

  changeCurrentDF(currentBlockID: number) {
    this.ws.next(new WebSocketMessageEvent("ChangeCurrentDF", currentBlockID.toString(), "",  JSON.stringify(this.settings.settings), this.settings.settings.uniqueID))
  }

  EndSession() {
    this.ws.next(new WebSocketMessageEvent("EndSession", "", "",  "", this.settings.settings.uniqueID))
  }

  DeleteNode(id: number) {
    this.ws.next(new WebSocketMessageEvent("DeleteNode", id.toString(), "",  JSON.stringify(this.settings.settings), this.settings.settings.uniqueID))
  }
}

export class WebSocketMessageEvent {
  message: string = "";
  data: string = "";
  origin: string = "";
  settings: string = "";
  id: string = "";
  constructor(message?: string, data?: string, origin?: string, settings?: string, id?: string) {
    if (message) {
      this.message = message
    }

    if (data) {
      this.data = data
    }
    if (origin) {
      this.origin = origin
    }
    if (settings) {
      this.settings = settings
    }
    if (id) {
      this.id = id
    }
  }
}
