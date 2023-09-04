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
