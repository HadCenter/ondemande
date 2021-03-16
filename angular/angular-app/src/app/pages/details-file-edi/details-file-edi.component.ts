import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-details-file-edi',
  templateUrl: './details-file-edi.component.html',
  styleUrls: ['./details-file-edi.component.css']
})
export class DetailsFileEdiComponent implements OnInit {
  id: any;

  constructor(private route: ActivatedRoute) { 
   this.id=this.route.snapshot.params.id;
   console.warn(this.id)
  }

  ngOnInit(): void {

  }

}
