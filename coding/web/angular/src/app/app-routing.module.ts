import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RootAlphaComponent } from './root-alpha/root-alpha.component';
import { RootBetaComponent } from './root-beta/root-beta.component';

const routes: Routes = [
  { path: 'alpha', component: RootAlphaComponent },
  { path: 'beta', component: RootBetaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
