import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
   })
export class Logger {
    count = 0;

    constructor() {}

    log(msg: any)   { this.count++; console.log("(" + this.count + ") " + msg); }
    error(msg: any) { this.count++; console.error("(" + this.count + ") " + msg); }
    warn(msg: any)  { this.count++; console.warn("(" + this.count + ") " + msg); }
}
