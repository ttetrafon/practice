import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LocalStorageService } from './services/local-storage.service';
import { Logger } from './services/logger.service';
import { RootAlphaComponent } from './root-alpha/root-alpha.component';
import { RootBetaComponent } from './root-beta/root-beta.component';

@NgModule({
  declarations: [
    AppComponent,
    RootAlphaComponent,
    RootBetaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    Logger,
    LocalStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
