import { Component, OnInit } from '@angular/core';
import { Logger } from '../services/logger';

@Component({
  selector: 'app-root-alpha',
  templateUrl: './root-alpha.component.html',
  styleUrls: ['./root-alpha.component.css']
})
export class RootAlphaComponent implements OnInit {

  constructor(private logger: Logger) { }

  ngOnInit(): void {
  }

  log(): void {
    console.log("---> RootAlphaComponent.log()");
    this.logger.log("alpha here!");
  }

}
