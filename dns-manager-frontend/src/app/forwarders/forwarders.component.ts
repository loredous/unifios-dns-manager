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

  constructor() {
    this.selectedForwarder = {} as DnsForwarderEntry;
    this.refreshData();
  }

  onEdit(addressId: number) {
    this.selectedForwarder = this.dataInterfaceService.getForwarderById(addressId);
    this.editModalOpen = true;
  }

  refreshData() {
    this.dnsforwarders = this.dataInterfaceService.getAllForwarders();
  }

  editModalClosed(result: EditModalResult) {
    this.editModalOpen = false;
    if (result.save) {
      this.dataInterfaceService.updateForwarder(result.item as DnsForwarderEntry);
    }
    this.refreshData();
  }

  addItem() {
    this.selectedForwarder = {} as DnsForwarderEntry;
    this.editModalOpen = true;
  }

  deleteItem(entry: DnsForwarderEntry) {
    this.dataInterfaceService.deleteForwarder(entry);
  }
}
