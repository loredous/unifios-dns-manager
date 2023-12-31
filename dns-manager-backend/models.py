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
from typing import Any, ClassVar, List
from pydantic import BaseModel, ConfigDict, ValidationError, model_validator
from sqlalchemy.util import classproperty
from database import Base, DBAddressEntry, DBForwarderEntry, DBConnection

class ORMMappedModel(BaseModel):
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)
    id: int = None
    _orm_type: ClassVar[type] = None
    _orm_initialized: ClassVar[bool] = False
    _orm_db_item: Base = None

    @classproperty
    def _orm_db_connection(cls) -> DBConnection:
        return DBConnection.get_connection()

    @classmethod
    def get_all(cls):
        return cls._orm_db_connection.get_all(cls._orm_type)
    
    @classmethod
    def get_by_id(cls, id: int):
        dbobj = cls._orm_db_connection.get_item_by_id(cls._orm_type, id)
        if dbobj:
            obj = cls.from_orm(dbobj[0])
            obj._orm_db_item = dbobj[0]
            return obj
        else:
            return None
        
    
    def model_post_init(self, __context: Any) -> None:
        self._orm_db_item = self._orm_type(**self.model_dump(exclude_unset=True))
        self._orm_db_connection.add_item(self._orm_db_item)
    
    def save(self):
        if self.id:
            self._orm_db_item = self._orm_db_connection.get_item_by_id(self._orm_type, self.id)[0]
            self._orm_db_connection.update_item(self._orm_db_item, self.model_dump())
        else:
            self._orm_db_item = self._orm_type(**self.model_dump())
            self._orm_db_connection.add_item(self._orm_db_item)
            self.id = self._orm_db_item.id
    
    def delete(self):
        self._orm_db_connection.delete_item(self._orm_db_item)
        self._orm_db_item = None
    
    @model_validator(mode='after')
    def is_not_deleted(self):
        if not self._orm_db_item:
            AssertionError('Unable to change item that has been deleted from DB.')
        return self
        
class DnsAddressEntry(ORMMappedModel):
    _orm_type = DBAddressEntry

    fqdn: str
    address: str
    note: str = ""
    
class DnsForwarderEntry(ORMMappedModel):
    _orm_type = DBForwarderEntry
    
    suffix: str
    address: str
    note: str = ""
    
class NewDnsAddressEntry(BaseModel):
    fqdn: str
    address: str
    note: str = ""
    
class NewDnsForwarderEntry(BaseModel):
    suffix: str
    address: str
    note: str = ""
    
