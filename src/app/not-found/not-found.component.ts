import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
	message: string = 'Looks like you\'ve got the wrong URL.';
	title: string = 'Sorry!';
	
  constructor( private route: ActivatedRoute ) { }

  ngOnInit() {
			console.log(this.route.snapshot.data)
		if( this.route.snapshot.data ) {
			this.message = this.route.snapshot.data.message || this.message;
			this.title = this.route.snapshot.data.title || this.title;
		}
  }

}
