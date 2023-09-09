import asyncio
import hashlib
import os

from sqlalchemy.orm import exc
from database import DBConnection, DBAddressEntry, DBForwarderEntry


HEADER_BLOCK_TEXT = """
#### DO NOT MANUALLY EDIT THIS FILE! #####
# This file is created and managed by the#
# UnifiOS DNS Manager utility. Any manual#
# changes will be erased regularly.      #
##########################################


"""

class ConfigFileManager():
    @property
    def _db_connection(self) -> DBConnection:
        return DBConnection.get_connection()
    
    def __init__(self, filename: str = "/run/dnsmasq.conf.d/conditional_dns.conf", refresh_interval: int = 60, pidfile="/run/dnsmasq.pid") -> None:
        self.filename = filename
        self.refresh_interval = refresh_interval
        self.pidfile = pidfile
        self.event_loop = asyncio.get_running_loop()
        self.timer_handle = None
        
    def start(self):
        self.timer_handle = self.event_loop.call_soon(self.refresh_config)
        self.known_hash = ""
        
    def refresh_config(self):
        current_hash = self.generate_config_hash()
        if current_hash != self.known_hash:
            self.write_config()
            self.known_hash = self.generate_config_hash() or ""
            self.kill_dnsmasq()
        self.timer_handle = self.event_loop.call_later(self.refresh_interval, self.refresh_config)
            
    def write_config(self):
        try:
            config_out = HEADER_BLOCK_TEXT
            forwarders = self._db_connection.get_all(DBForwarderEntry)
            addresses = self._db_connection.get_all(DBAddressEntry)
            for address in addresses:
                config_out += f"address=/{address.fqdn}/{address.address}/ \n"
            for forwarder in forwarders:
                config_out += f"server=/{forwarder.suffix}/{forwarder.address}/ \n"
            with open(self.filename, 'w') as conf_file:
                conf_file.write(config_out)
        except Exception as ex:
            print(ex)
        
    def kill_dnsmasq(self):
        try:
            pid = 0
            with open(self.pidfile, 'r') as pidfile:
                pid = int(pidfile.read())
            os.kill(pid, 9)
        except Exception as ex:
            print(ex)
        
    def force_update(self):
        self.known_hash = ""
        if self.timer_handle:
            self.timer_handle.cancel()
        self.refresh_config()
    
    def generate_config_hash(self):
        if os.path.isfile(self.filename):
            sha_hash = hashlib.sha1()
            with open(self.filename, 'rb', buffering=0) as conf_file:
                while True:
                    data = conf_file.read(65536)
                    if not data:
                        break
                    sha_hash.update(data)
            return sha_hash.hexdigest()
        else:
            return None
        
    def stop(self):
        self.timer_handle.cancel()