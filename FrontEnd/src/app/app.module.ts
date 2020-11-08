import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SpeakComponent } from './speak/speak.component';
import { TranscribeComponent } from './transcribe/transcribe.component';
import { TranslateComponent } from './translate/translate.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SpeakComponent,
    TranscribeComponent,
    TranslateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
