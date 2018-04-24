import { Component, OnInit } from '@angular/core';
import { ShortenerService } from '../shortener.service';
import { UrlModel } from '../url.model';

@Component({
  selector: 'app-short-list',
  templateUrl: './short-list.component.html',
  styleUrls: ['./short-list.component.css']
})
export class ShortListComponent implements OnInit {
	activeURL: UrlModel;
	urlList: UrlModel[] = [];
	
  constructor( private short: ShortenerService ) { }

  ngOnInit() {
		if(this.urlList.length == 0){
			this.short.getAll().subscribe( urls => {
				this.urlList = urls;
			});
		}
	}
	setActive(url: UrlModel){
		this.activeURL = url;
	}
	onToggle(url){
		url = url || this.activeURL;
		if(url){
			url.active = !url.active;
			this.short
				.update(url.hash, url)
				.subscribe(url => {});
		}
	}
	onDelete(){
		if(this.activeURL){
			this.short
				.remove(this.activeURL)
				.subscribe(url => {
					for(let i = 0, len = this.urlList.length; i < len; i++){
						if(this.urlList[i].hash == this.activeURL.hash){
							this.urlList.splice(i,1);
							break;
						}
					}
					this.activeURL = null;
				});
		}
	}
	onCloseDetails(){
		this.activeURL = null;
	}
}
