import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WorldmapComponent } from './worldmap/worldmap.component';

@NgModule({
  declarations: [
    AppComponent,
    WorldmapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [WorldmapComponent]
})
export class AppModule { }
