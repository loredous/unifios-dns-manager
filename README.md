# UnifiOS DNS Manager
UnifiOS DNS Manager is a utility designed to help manage static DNS and conditional forwarder entries on devices such as the Unifi Dream Machine Pro.

The utility works in a few parts:

*   An Angular web interface for user interaction
*   A Python FastAPI API managing persistent entries in a SQLite database
*   Entries in a dnsmasq configuration file on the device itself

By keeping entries persistent in a separate database, and regularly checking to see if the device configuration needs to be updated, we are able to persist DNS entries across events such as reboots and other changes.

## Addresses


Entries in the Addresses section are for linking a single, fully qualified domain name to a specific IP address. For example you might want to link the name "unifi.example.com" to the address "10.0.0.1". The notes field is purely for your reference, and as such is optional.

## Forwarders


Entries in the Forwarders section are for configuring conditional DNS forwarding. Conditional DNS forwarding is a method to direct DNS queries related to a specific domain to another DNS server. For example if you maintain a separate DNS server for the custom domain "example.com", you could forward all queries for "example.com" to this DNS server.