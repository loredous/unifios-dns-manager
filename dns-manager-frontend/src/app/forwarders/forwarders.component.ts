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
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { DnsForwarderEntry } from '../dnsforwarderentry'
import { DataInterface } from '../dataInterface.service';
import { EditforwardermodalComponent } from '../editforwardermodal/editforwardermodal.component';
import { EditModalResult } from '../editmodalresult';

@Component({
  selector: 'app-forwarders',
  standalone: true,
  imports: [CommonModule, ClarityModule, EditforwardermodalComponent],
  templateUrl: './forwarders.component.html',
  styleUrls: ['./forwarders.component.css']
})
export class ForwardersComponent {
  dataInterfaceService: DataInterface = inject(DataInterface);

  selectedForwarder!: DnsForwarderEntry;
  dnsforwarders!: DnsForwarderEntry[];
  editModalOpen: boolean = false;
  loading: boolean = false;

  constructor() {
    this.selectedForwarder = {} as DnsForwarderEntry;
    this.refreshData();
  }

  onEdit(forwarderId: number) {
    this.loading = true
    this.dataInterfaceService.getForwarderById(forwarderId).subscribe(
      (response: DnsForwarderEntry) => { this.selectedForwarder = response; this.loading = false; },
      (error) => { console.warn(error); this.selectedForwarder = {} as DnsForwarderEntry; this.loading = false; }
    )
    this.editModalOpen = true;
  }

  refreshData() {
    this.loading = true
    this.dataInterfaceService.getAllForwarders().subscribe(
      (response: DnsForwarderEntry[]) => { this.dnsforwarders = response; this.loading = false; },
      (error) => { console.warn(error); this.dnsforwarders = []; this.loading = false; }
    )
  }

  editModalClosed(result: EditModalResult) {
    this.editModalOpen = false;
    if (result.save) {
      this.dataInterfaceService.updateForwarder(result.item as DnsForwarderEntry).subscribe(
        (response) => { this.refreshData() },
        (error) => { this.refreshData() }
      );
    }
    this.refreshData();
  }

  addItem() {
    this.selectedForwarder = {} as DnsForwarderEntry;
    this.editModalOpen = true;
  }

  deleteItem(entry: DnsForwarderEntry) {
    this.dataInterfaceService.deleteForwarder(entry).subscribe();
    this.refreshData();
  }
}
