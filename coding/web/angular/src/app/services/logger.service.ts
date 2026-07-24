import { Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
  providedIn: 'root',
})
export class Logger {
  count = 0;

  constructor(private ls: LocalStorageService) {
    console.log("Logger started");
    this.readCounter();
  }

  log(msg: any)   {
    this.incrementCounter();
    console.log("(" + this.count + ") " + msg);
  }

  error(msg: any) {
    this.incrementCounter();
    console.error("(" + this.count + ") " + msg);
  }

  warn(msg: any)  {
    this.incrementCounter();
    console.warn("(" + this.count + ") " + msg);
  }

  private incrementCounter(): void {
    this.readCounter();
    this.count++;
    this.ls.setItem("count", this.count.toString());
  }

  private readCounter(): void {
    let currentCount = this.ls.getItem("count"); // TODO: put this in a dictionary/enum somewhere instead of typing keys for local storage!
    if (currentCount) {
      console.log("... count found in local storage: " + currentCount);
      this.count = parseInt(currentCount);
    }
    else {
      console.log("... count not found in local storage");
      this.ls.setItem("count", "0");
    }
  }

}
