from collections import defaultdict
from ctypes import ArgumentError
from logging import Logger, getLogger
from re import L
from typing import Any, List
from sqlalchemy import create_engine, exc, null, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session

class Base(DeclarativeBase):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    
    def update_fields(self, field: str, value):
        self.__setattr__(field, value)
        

class DBAddressEntry(Base):
    __tablename__ = "address_entry"
    
    fqdn: Mapped[str]
    address: Mapped[str]
    note: Mapped[str]
    
    def __repr__(self) -> str:
        return f"DBAddressEntry(ID:{self.id}, FQDN:{self.fqdn}, Address:{self.address}, Note:{self.note})"
    
class DBForwarderEntry(Base):
    __tablename__ = "forwarder_entry"
    
    suffix: Mapped[str]
    address: Mapped[str]
    note: Mapped[str]
    
    def __repr__(self) -> str:
        return f"DBForwarderEntry(ID:{self.id}, Suffix:{self.suffix}, Address:{self.address}, Note:{self.note})"
    
class DBConnection():

    def __init__(self, connection_string: str = "sqlite://", create_on_init: bool = True, delete_existing: bool = False, logger: Logger = None) -> None:
        if not logger:
            logger = getLogger(self.__class__.__name__)
        self.logger = logger
        self.logger.debug('Initializing database connection instance')
        self.connection_string = connection_string
        self._engine = create_engine(self.connection_string)
        self._session = None
        if delete_existing:
            self.logger.info('Database wipe requested, deleting existing tables')
            Base.metadata.drop_all()
        if create_on_init:
            self.logger.debug('Creating/confirming database objects')
            Base.metadata.create_all(self._engine)
    
    @property
    def session(self) -> Session:
        if not self._session:
            self._session = Session(self._engine)
        return self._session
    
    def get_all(self, DBType: type) -> List[Base]:
        self.logger.debug('Get all requested for type %s' % DBType.__name__)
        if not issubclass(DBType, Base):
            raise ArgumentError('DBType must be a subclass of the current SqlAlchemy Base type.')
        result = self.session.query(DBType).all()
        self.logger.debug('Returning %d records' % len(result))
        return result
    
    def update_item(self, DBItem: Base, fields: dict) -> bool:
        try:
            for field in fields:
                DBItem.update_fields(field, fields[field])
            self.session.commit()
            return True
        except Exception as e:
            self.logger.exception('Exception when updating item:')
            self.session.rollback();
            return False
        
    def add_item(self, DBItem: Base) -> bool:
        try:
            self.session.add(DBItem)
            self.session.commit()
            return True
        except Exception as e:
            self.logger.exception('Exception when adding item:')
            self.session.rollback();
            return False
    
    def get_item_by_id(self, DBType: type ,id: int) -> Base:
        if not issubclass(DBType, Base):
            raise ArgumentError('DBType must be a subclass of the current SqlAlchemy Base type.')
        try:
            return self.session.execute(select(DBType).where(DBType.id == id)).one_or_none()
        except Exception as e:
            self.logger.exception('Exception getting item by ID:')
            return null
            
    def delete_item_by_id(self, DBType: type, id:int) -> bool:
        if not issubclass(DBType, Base):
            raise ArgumentError('DBType must be a subclass of the current SqlAlchemy Base type.')
        try:
            item = self.get_item_by_id(DBType=DBType, id=id)
            if not item:
                self.logger.warning('Nonexistent item requested for deletion (type: "%s", id: %d)' % DBType.__name__, id)
                return True
            self.session.delete(item)
            self.session.commit()
            return True
        except Exception as e:
            self.logger.exception('Exception deleting item by ID:')
            return False
    
    def delete_item(self, DBItem: Base) -> bool:
        try:
            self.session.delete(DBItem)
            self.session.commit()
            return True
        except Exception as e:
            self.logger.exception('Exception deleting item:')
            return False