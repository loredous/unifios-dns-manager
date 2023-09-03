import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { DnsForwarderEntry } from '../dnsforwarderentry';
import { EditModalResult } from '../editmodalresult';


@Component({
  selector: 'app-editforwardermodal',
  standalone: true,
  imports: [CommonModule, ClarityModule, FormsModule],
  templateUrl: './editforwardermodal.component.html',
  styleUrls: ['./editforwardermodal.component.css']
})
export class EditforwardermodalComponent {
  @Input() forwarderEntry!: DnsForwarderEntry;
  @Input() editModalOpen: boolean = false;

  @Output() resultAvailable = new EventEmitter<EditModalResult>();

  saveEntry() {
    let result: EditModalResult = { item: this.forwarderEntry, save: true };
    this.resultAvailable.emit(result);
  }

  cancel() {
    let result: EditModalResult = { item: this.forwarderEntry, save: false };
    this.resultAvailable.emit(result);
  }
}

