# 
# This file is part of the UnifiOS DNS Manager distribution (https://github.com/loredous/unifios-dns-manager).
# Copyright (c) 2023 Jeremy Banker.
# 
# This program is free software: you can redistribute it and/or modify  
# it under the terms of the GNU General Public License as published by  
# the Free Software Foundation, version 3.
#
# This program is distributed in the hope that it will be useful, but 
# WITHOUT ANY WARRANTY; without even the implied warranty of 
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU 
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License 
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
from typing import List
from fastapi import FastAPI, HTTPException
from models import DnsAddressEntry, DnsForwarderEntry, NewDnsAddressEntry, NewDnsForwarderEntry
from contextlib import asynccontextmanager
import uvicorn
from fastapi.middleware.cors import CORSMiddleware



@asynccontextmanager
async def lifespan(app: FastAPI):
    DnsForwarderEntry.initialize_orm()
    DnsAddressEntry.initialize_orm()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/status/")
async def status():
    DnsForwarderEntry._orm_db_connection.session.execute("SELECT 1")
    DnsAddressEntry._orm_db_connection.session.execute("SELECT 1")

@app.get("/address/")
async def get_all_addresses() -> List[DnsAddressEntry]:
    return DnsAddressEntry.get_all()

@app.get("/forwarder/")
async def get_all_forwarders() -> List[DnsForwarderEntry]:
    return DnsForwarderEntry.get_all()

@app.get("/address/{id}")
async def get_address(id: int) -> DnsAddressEntry:
    result = DnsAddressEntry.get_by_id(id)
    if result:
        return result
    else:
        raise HTTPException(status_code=404, detail="Item not found")

@app.get("/forwarder/{id}")
async def get_forwarder(id: int) -> DnsForwarderEntry:
    result = DnsForwarderEntry.get_by_id(id)
    if result:
        return result
    else:
        raise HTTPException(status_code=404, detail="Item not found")

@app.post("/address/")
async def add_address(new_address: NewDnsAddressEntry) -> DnsAddressEntry:
    address = DnsAddressEntry(**new_address.model_dump())
    address.save();
    return address

@app.post("/forwarder/")
async def add_forwarder(new_forwarder: NewDnsForwarderEntry) -> DnsForwarderEntry:
    forwarder = DnsForwarderEntry(**new_forwarder.model_dump())
    forwarder.save();
    return forwarder

@app.put("/address/")
async def update_address(address: DnsAddressEntry) -> DnsAddressEntry:
    address.save();
    return address

@app.put("/forwarder/")
async def update_forwarder(forwarder: DnsForwarderEntry) -> DnsForwarderEntry:
    forwarder.save();
    return forwarder

@app.delete("/address/{id}")
async def delete_address(id: int):
    entry = DnsAddressEntry.get_by_id(id)
    if entry:
        entry.delete()
        
@app.delete("/forwarder/{id}")
async def delete_forwarder(id: int):
    entry = DnsForwarderEntry.get_by_id(id)
    if entry:
        entry.delete()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)