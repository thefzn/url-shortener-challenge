import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UrlModel } from '../url.model';

@Component({
  selector: 'app-short-details',
  templateUrl: './short-details.component.html',
  styleUrls: ['./short-details.component.css']
})
export class ShortDetailsComponent implements OnInit {
	@Input() url: UrlModel;
	
  @Output() onDelete = new EventEmitter();
  @Output() onToggle = new EventEmitter();
  @Output() onCloseDetails = new EventEmitter();
	
  constructor() { }
  ngOnInit() { }
	
  doToggle () {
		console.log("toggle", this, this.onToggle);
    this.onToggle.emit();
  }
	doClose() {
		console.log("close", this, this.onCloseDetails);
    this.onCloseDetails.emit();
	}
	doDelete() {
		console.log("delete", this, this.onDelete);
    this.onDelete.emit();
	}

}
