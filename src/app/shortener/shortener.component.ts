import { Component, OnInit } from '@angular/core';
import { ShortenerService } from '../shortener.service';
import { UrlModel } from '../url.model';

@Component({
  selector: 'app-shortener',
  templateUrl: './shortener.component.html',
  styleUrls: ['./shortener.component.css']
})
export class ShortenerComponent implements OnInit {
	rawURL: string = "";
	shortURL : string = "";
	errMsg: string = "";
	activeURL: UrlModel;
	private shortenURL: string = "";
  constructor( private short: ShortenerService ) { }
	shorten(){
		const pattern = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
		this.rawURL = this.rawURL.indexOf("http") != -1 ? this.rawURL : "http://" + this.rawURL;
		if(pattern.test(this.rawURL)){
			this.errMsg = "";
			this.short
				.shorten(this.rawURL)
				.subscribe(url => {
					this.activeURL = url;
				});
		}else{
			this.errMsg = "The provided URL is invalid";
		}
	}
	onToggle(){
		if(this.activeURL){
			this.activeURL.active = !this.activeURL.active;
			this.short
				.update(this.activeURL.hash, this.activeURL)
				.subscribe(url => {});
		}
	}
	onDelete(){
		if(this.activeURL){
			this.short
				.remove(this.activeURL)
				.subscribe(url => {
					this.activeURL = null;
				});
		}
	}
	onCloseDetails(){
		this.activeURL = null;
	}
  ngOnInit() {}

}
