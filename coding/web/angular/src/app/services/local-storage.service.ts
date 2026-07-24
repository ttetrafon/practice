import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  // TODO: create cache of local storage, and use events to know when a value has changed instead of reading from local storage all the time

  constructor() {
    console.log("LocalStorageService started");
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

}
