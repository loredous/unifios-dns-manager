import { Component, inject } from '@angular/core';
import { DnsAddressEntry } from './dnsaddressentry';
import { DataInterface } from './dataInterface.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'UnifiOS DNS Manager';

  constructor() {
  }
  
}
