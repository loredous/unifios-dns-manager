import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { DnsAddressEntry } from '../dnsaddressentry';
import { EditModalResult } from '../editmodalresult';

@Component({
  selector: 'app-editaddressmodal',
  standalone: true,
  imports: [CommonModule, ClarityModule, FormsModule],
  templateUrl: './editaddressmodal.component.html',
  styleUrls: ['./editaddressmodal.component.css']
})
export class EditaddressmodalComponent {
  @Input() addressEntry!: DnsAddressEntry;
  @Input() editModalOpen: boolean = false;
  @Output() resultAvailable = new EventEmitter<EditModalResult>();

  saveEntry() {
    let result: EditModalResult = { item: this.addressEntry, save: true };
    this.resultAvailable.emit(result);
  }

  cancel() {
    let result: EditModalResult = { item: this.addressEntry, save: false };
    this.resultAvailable.emit(result);
  }
}
