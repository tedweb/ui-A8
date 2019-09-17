import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

import { NavItemComponent } from './navitem/navitem.component';
import { NavigatorComponent } from './navigator.component';

@NgModule({
  imports: [
    BrowserModule,
    MatIconModule
  ],
  declarations: [
    NavigatorComponent,
    NavItemComponent
  ],
  exports: [
    NavigatorComponent
  ]
})
export class NavigatorModule { }
