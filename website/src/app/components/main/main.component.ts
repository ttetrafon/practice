import { Component, OnInit } from '@angular/core';
import { Helper } from '../../models/helper';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  helper: Helper = new Helper();
  currentView = 'yadts'; // yadts, cv, portfolio

  constructor() {}

  ngOnInit(): void {
  }

}
