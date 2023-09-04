import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

// Clarity Design System Imports
import { ClarityModule } from "@clr/angular";
import '@cds/core/icon/register.js';
import { CdsModule } from '@cds/angular';
import { ClarityIcons, cogIcon, networkGlobeIcon, helpIcon, libraryIcon, plusIcon } from '@cds/core/icon';

// Internal Imports
import { AddressesComponent } from './addresses/addresses.component';
import { ForwardersComponent } from './forwarders/forwarders.component';
import { HelpModalComponent } from './help-modal/help-modal.component'

ClarityIcons.addIcons(cogIcon, networkGlobeIcon, helpIcon, libraryIcon, plusIcon);

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
    AddressesComponent,
    ForwardersComponent,
    HelpModalComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}
