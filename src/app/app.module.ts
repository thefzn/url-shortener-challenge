import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

const appRoutes: Routes = [
//  { path: '',
//    component: SomeComponent,
//  }
];
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
		BrowserModule,
		HttpClientModule,
		RouterModule.forRoot(
			appRoutes,
			{ enableTracing: true } // <-- debugging purposes only
		)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
