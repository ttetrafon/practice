import { Component, OnInit } from '@angular/core';
import { Logger } from '../services/logger.service';

@Component({
  selector: 'app-root-beta',
  templateUrl: './root-beta.component.html',
  styleUrls: ['./root-beta.component.css']
})
export class RootBetaComponent implements OnInit {

  constructor(private logger: Logger) { }

  ngOnInit(): void {
  }

  log(): void {
    console.log("---> RootBetaComponent.log()");
    this.logger.log("alpha here!");
  }

}
