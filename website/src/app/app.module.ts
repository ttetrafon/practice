import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { YadtsComponent } from './components/yadts/yadts.component';
import { CvComponent } from './components/cv/cv.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    YadtsComponent,
    CvComponent,
    PortfolioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
