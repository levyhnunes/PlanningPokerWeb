import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DeckCardComponent } from './pages/deck-card/deck-card.component';
import { LoginComponent } from './pages/login/login.component';

import {
  AuthGuardService as AuthGuard
} from './auth/auth-guard.service';

const routes: Routes = [
  { path: 'room', component: DeckCardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/room', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
