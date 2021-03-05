
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
@Input() width : string;
@Input() height : string
@Input() bg : string
@Input() show : boolean;
@Input() position : string;
@ViewChild('loader') loader: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }

}
