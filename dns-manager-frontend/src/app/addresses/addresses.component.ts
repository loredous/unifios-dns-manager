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

  constructor() {
    this.selectedAddress = {} as DnsAddressEntry;
    this.refreshData();
  }

  onEdit(addressId: number) {
    this.selectedAddress = this.dataInterfaceService.getAddressById(addressId);
    this.editModalOpen = true;
  }

  refreshData() {
    this.dnsaddresses = this.dataInterfaceService.getAllAddresses();
  }

  editModalClosed(result: EditModalResult) {
    this.editModalOpen = false;
    if (result.save) {
      this.dataInterfaceService.updateAddress(result.item as DnsAddressEntry);
    }
    this.refreshData();
  }

  addItem() {
    this.selectedAddress = {} as DnsAddressEntry;
    this.editModalOpen = true;
  }

  deleteItem(entry: DnsAddressEntry) {
    this.dataInterfaceService.deleteAddress(entry);
  }
}
