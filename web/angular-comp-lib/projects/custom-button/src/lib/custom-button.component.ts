import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lib-custom-button',
  template: `<button [style.color]='color'>{{body}}</button>`,
  styles: []
})
export class CustomButtonComponent implements OnInit {
  @Input() color: string = "#000";
  @Input() body: string = "Hello world"

  constructor() { }

  ngOnInit(): void {}

}
