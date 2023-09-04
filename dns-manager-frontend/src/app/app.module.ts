// This file is part of the UnifiOS DNS Manager distribution (https://github.com/loredous/unifios-dns-manager).
// Copyright (c) 2023 Jeremy Banker.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
