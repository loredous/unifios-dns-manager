import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ClarityModule } from "@clr/angular";
import '@cds/core/icon/register.js';
import { CdsModule } from '@cds/angular';
import { ClarityIcons, cogIcon, networkGlobeIcon, helpIcon, libraryIcon } from '@cds/core/icon';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { AddressesComponent } from './addresses/addresses.component';

ClarityIcons.addIcons(cogIcon, networkGlobeIcon, helpIcon, libraryIcon);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClarityModule,
    HttpClientModule,
    CdsModule,
    AddressesComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
