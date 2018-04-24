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
	private urlList: UrlModel[] = [];
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
					this.urlList.push(this.activeURL);
					console.log(this.urlList)
				});
		}else{
			this.errMsg = "The provided URL is invalid";
		}
	}
	onToggle(){
		console.log("toggle",this.activeURL);
		if(this.activeURL){
			this.activeURL.active = !this.activeURL.active;
			this.short
				.toggle(this.activeURL)
				.subscribe(url => {
					console.log(this.urlList)
				});
		}
	}
	onDelete(){
		if(this.activeURL){
			this.short
				.remove(this.activeURL)
				.subscribe(url => {
					for(let i = 0, len = this.urlList.length; i < len; i++){
						if(this.urlList[i] == this.activeURL){
							this.urlList = this.urlList.splice(i,1);
							break;
						}
					}
					console.log(this.urlList);
					//this.activeURL = null;
				});
		}
	}
	onCloseDetails(){
		this.activeURL = null;
	}
  ngOnInit() {}

}
