import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WorldmapComponent } from './worldmap/worldmap.component';
import { CountryComponent } from './country/country.component';
import { NewspanelComponent } from './newspanel/newspanel.component';

@NgModule({
  declarations: [
    AppComponent,
    WorldmapComponent,
    CountryComponent,
    NewspanelComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
