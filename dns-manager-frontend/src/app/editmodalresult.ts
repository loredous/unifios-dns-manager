import { DnsAddressEntry } from "./dnsaddressentry";
import { DnsForwarderEntry } from "./dnsforwarderentry";

export interface EditModalResult {
  item: DnsAddressEntry | DnsForwarderEntry;
  save: boolean;
}
