from typing import Any, ClassVar, List, Self
from pydantic import BaseModel, ConfigDict, ValidationError, model_validator
from database import Base, DBAddressEntry, DBForwarderEntry, DBConnection

class ORMMappedModel(BaseModel):
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)
    id: int = None
    _orm_type: ClassVar[type] = None
    _orm_db_connection: ClassVar[DBConnection] = None
    _orm_initialized: ClassVar[bool] = False
    _orm_db_item: Base = None

    @classmethod
    def initialize_orm(cls, connection_string: str = "sqlite://", create_on_init: bool = True, delete_existing: bool = False):
        cls._orm_db_connection = DBConnection(connection_string=connection_string, create_on_init=create_on_init, delete_existing=delete_existing)
        cls._orm_initialized = True

    @classmethod
    def get_all(cls) -> List[Self]:
        return cls._orm_db_connection.get_all(cls._orm_type)
    
    @classmethod
    def get_by_id(cls, id: int) -> Self:
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
    def is_not_deleted(self) -> Self:
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