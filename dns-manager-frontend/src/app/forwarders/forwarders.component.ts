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
