import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { ShortenerService } from './shortener.service';

import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { ShortenerComponent } from './shortener/shortener.component';
import { ShortDetailsComponent } from './short-details/short-details.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ShortListComponent } from './short-list/short-list.component';

const appRoutes: Routes = [
  { path: 'list',
    component: ShortListComponent
  },
  { path: '503',
    component: NotFoundComponent,
	 	data: { message: 'Looks like you have the wrong short code.' }
  },
  { path: '',
    component: ShortenerComponent,
  },
  { path: '**',
    component: NotFoundComponent,
  },
];
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    ShortenerComponent,
    ShortDetailsComponent,
    NotFoundComponent,
    ShortListComponent
  ],
  imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		RouterModule.forRoot(
			appRoutes,
			{ enableTracing: true } // <-- debugging purposes only
		)
  ],
  providers: [
		ShortenerService
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
