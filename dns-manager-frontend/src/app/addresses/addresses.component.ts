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
import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { DnsAddressEntry } from '../dnsaddressentry'
import { DataInterface } from '../dataInterface.service';
import { EditaddressmodalComponent } from '../editaddressmodal/editaddressmodal.component';
import { EditModalResult } from '../editmodalresult';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, ClarityModule, EditaddressmodalComponent],
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent {
  dataInterfaceService: DataInterface = inject(DataInterface);
  
  selectedAddress!: DnsAddressEntry;
  dnsaddresses!: DnsAddressEntry[];
  editModalOpen: boolean = false;
  loading: boolean = false;

  constructor() {
    this.selectedAddress = {} as DnsAddressEntry;
    this.refreshData();
  }

  onEdit(addressId: number) {
    this.loading = true
    this.dataInterfaceService.getAddressById(addressId).subscribe(
      (response: DnsAddressEntry) => { this.selectedAddress = response; this.loading = false; },
      (error) => { console.warn(error); this.selectedAddress = {} as DnsAddressEntry; this.loading = false; }
    )
    this.editModalOpen = true;
  }

  refreshData() {
    this.loading = true
    this.dataInterfaceService.getAllAddresses().subscribe(
      (response: DnsAddressEntry[]) => { this.dnsaddresses = response; this.loading = false; },
      (error) => { console.warn(error); this.dnsaddresses = []; this.loading = false; }
    )
  }

  editModalClosed(result: EditModalResult) {
    this.editModalOpen = false;
    if (result.save) {
      this.dataInterfaceService.updateAddress(result.item as DnsAddressEntry).subscribe(
        (response) => { this.refreshData() },
        (error) => { this.refreshData() }
      );
    }
  }

  addItem() {
    this.selectedAddress = {} as DnsAddressEntry;
    this.editModalOpen = true;
  }

  deleteItem(entry: DnsAddressEntry) {
    this.dataInterfaceService.deleteAddress(entry).subscribe();
    this.refreshData();
  }
}
