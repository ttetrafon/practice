import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from '../app/components/main/main.component';
import { CvComponent } from '../app/components/cv/cv.component';
import { YadtsComponent } from '../app/components/yadts/yadts.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainComponent},
  { path: 'cv', component: CvComponent},
  { path: 'portfolio', component: PortfolioComponent},
  { path: 'yadts', component: YadtsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
