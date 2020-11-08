import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SpeakComponent } from './speak/speak.component';
import { TranscribeComponent } from './transcribe/transcribe.component';
import { TranslateComponent } from './translate/translate.component';

const routes: Routes = [
  {path:'speak', component: SpeakComponent},
  {path:'transcribe', component: TranscribeComponent},
  {path:'translate', component: TranslateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
