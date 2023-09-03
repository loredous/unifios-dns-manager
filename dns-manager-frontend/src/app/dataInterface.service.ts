import { Injectable } from '@angular/core';
import { DnsAddressEntry } from './dnsaddressentry';
import { DnsForwarderEntry } from './dnsforwarderentry';

@Injectable({
  providedIn: 'root'
})
export class DataInterface {

  dnsaddresses: DnsAddressEntry[] = [
    {
      id: 1,
      fqdn: 'test.local',
      address: '127.0.0.1',
      note: 'A local test address entry'
    },
    {
      id: 2,
      fqdn: '2.test.local',
      address: '127.0.0.2',
      note: 'Another local test address entry'
    }
  ]

  dnsforwarders: DnsForwarderEntry[] = [
    {
      id: 1,
      suffix: 'managed.local',
      address: '8.8.8.8',
      note: 'Forward requests for *.managed.local to 8.8.8.8'
    }
  ]

  constructor() { }

  getAllAddresses(): DnsAddressEntry[] {
    return this.dnsaddresses;
  }

  getAddressById(id: number): DnsAddressEntry {
    var copy: DnsAddressEntry = {...this.dnsaddresses.find(entry => entry.id == id) ?? {} as DnsAddressEntry }
    return copy;
  }

  getAllForwarders(): DnsForwarderEntry[] {
    return this.dnsforwarders;
  }

  getForwarderById(id: number): DnsForwarderEntry {
    var copy: DnsForwarderEntry = { ...this.dnsforwarders.find(entry => entry.id == id) ?? {} as DnsForwarderEntry };
    return copy;
  }

  updateAddress(entry: DnsAddressEntry) {
    if (entry.id != undefined)
    {
      var index_to_update = this.dnsaddresses.findIndex(item => item.id == entry.id);
      this.dnsaddresses[index_to_update] = entry;
    }
    else
    {
      entry.id = this.dnsaddresses.length + 1;
      this.dnsaddresses.push(entry);
    }
  }

  updateForwarder(entry: DnsForwarderEntry) {
    if (entry.id != undefined) {
      var index_to_update = this.dnsforwarders.findIndex(item => item.id == entry.id);
      this.dnsforwarders[index_to_update] = entry;  
    }
    else {
      entry.id = this.dnsaddresses.length + 1;
      this.dnsforwarders.push(entry);
    }
    
  }

  deleteForwarder(entry: DnsForwarderEntry) {
    var index_to_delete = this.dnsforwarders.findIndex(item => item.id == entry.id);
    this.dnsforwarders.splice(index_to_delete, 1);
  }

  deleteAddress(entry: DnsAddressEntry) {
    var index_to_delete = this.dnsaddresses.findIndex(item => item.id == entry.id);
    this.dnsaddresses.splice(index_to_delete, 1);
  }
}
