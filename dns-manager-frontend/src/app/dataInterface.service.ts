import { Injectable } from '@angular/core';
import { DnsAddressEntry } from './dnsaddressentry';
import { DnsForwarderEntry } from './dnsforwarderentry';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataInterface {

  API_ADDRESS: string = "http://localhost:8000"

  constructor(private http: HttpClient) { }

  getAllAddresses(): Observable<DnsAddressEntry[]> {
    return this.http.get<DnsAddressEntry[]>(this.API_ADDRESS.concat("/address/"));
  }

  getAddressById(id: number): Observable<DnsAddressEntry> {
    return this.http.get<DnsAddressEntry>(this.API_ADDRESS.concat("/address/", id.toString()));
  }

  getAllForwarders(): Observable<DnsForwarderEntry[]> {
    return this.http.get<DnsForwarderEntry[]>(this.API_ADDRESS.concat("/forwarder/"));
  }

  getForwarderById(id: number): Observable<DnsForwarderEntry> {
    return this.http.get<DnsForwarderEntry>(this.API_ADDRESS.concat("/forwarder/", id.toString()));
  }

  updateAddress(entry: DnsAddressEntry): Observable<DnsAddressEntry> {
    if (entry.id != undefined)
    {
      return this.http.put<DnsAddressEntry>(this.API_ADDRESS.concat("/address/"), entry)
    }
    else
    {
      return this.http.post<DnsAddressEntry>(this.API_ADDRESS.concat("/address/"), entry)
    }
  }

  updateForwarder(entry: DnsForwarderEntry) {
    if (entry.id != undefined) {
      return this.http.put<DnsForwarderEntry>(this.API_ADDRESS.concat("/forwarder/"), entry)
    }
    else {
      return this.http.post<DnsForwarderEntry>(this.API_ADDRESS.concat("/forwarder/"), entry)
    }
  }

  deleteForwarder(entry: DnsForwarderEntry): Observable<unknown> {
    return this.http.delete<unknown>(this.API_ADDRESS.concat("/forwarder/", entry.id.toString()))
  }

  deleteAddress(entry: DnsAddressEntry): Observable<unknown> {
    return this.http.delete<unknown>(this.API_ADDRESS.concat("/address/", entry.id.toString()))
  }
}
