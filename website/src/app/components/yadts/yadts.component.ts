import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-yadts',
  templateUrl: './yadts.component.html',
  styleUrls: ['./yadts.component.scss']
})
export class YadtsComponent implements OnInit {
  currentView: string = 'spellmaking' // magic, spellmaking

  constructor() {}

  ngOnInit(): void {}

}