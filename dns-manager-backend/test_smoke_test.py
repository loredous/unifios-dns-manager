from fastapi import testclient
from httpx import delete
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm.strategy_options import _raise_for_does_not_link
from models import DnsAddressEntry, DnsForwarderEntry
from api import app

@pytest.fixture
def test_client():
        with TestClient(app) as client:
            client.post("/address/", json={"fqdn": "testfqdn","address":"testaddress","note":"testnote"})
            client.post("/address/", json={"fqdn": "testfqdn2","address":"testaddress2","note":"testnote2"})
            client.post("/address/", json={"fqdn": "testfqdn3","address":"testaddress3","note":"testnote3"})
            client.post("/forwarder/", json={"suffix": "testsuffix","address":"testaddress","note":"testnote"})
            client.post("/forwarder/", json={"suffix": "testsuffix2","address":"testaddress2","note":"testnote2"})
            client.post("/forwarder/", json={"suffix": "testsuffix3","address":"testaddress3","note":"testnote3"})
            yield client    
 
def test_get_all_addresses(test_client):
        response = test_client.get("/address/")
        
        assert response.status_code == 200
        assert len(response.json()) == 3
        
def test_get_all_forwarders(test_client):
        response = test_client.get("/forwarder/")
        
        assert response.status_code == 200
        assert len(response.json()) == 3
        
def test_get_address_by_id(test_client):
        response = test_client.get("/address/1")
        
        assert response.status_code == 200
        assert response.json()['id'] == 1
        
def test_get_forwarder_by_id(test_client):
        response = test_client.get("/forwarder/1")
        
        assert response.status_code == 200
        assert response.json()['id'] == 1

def test_get_address_by_id_nonexistent(test_client):
        response = test_client.get("/address/99")
        
        assert response.status_code == 404
        
def test_get_forwarder_by_id_nonexistent(test_client):
        response = test_client.get("/forwarder/99")
        
        assert response.status_code == 404
        
def test_update_address(test_client):
        response = test_client.put("/address/", json={"id":1, "fqdn": "testfqdn_updated","address":"testaddress_updated","note":"testnote_updated"})
        
        assert response.status_code == 200
        assert response.json()['id'] == 1
        assert response.json()['fqdn'] == "testfqdn_updated"
        
        response_two = test_client.get("/address/1")
        assert response.json() == response_two.json()
        
def test_update_forwarder(test_client):
        response = test_client.put("/forwarder/", json={"id":1, "suffix": "testsuffix_updated","address":"testaddress","note":"testnote"})
        
        assert response.status_code == 200
        assert response.json()['id'] == 1
        assert response.json()['suffix'] == "testsuffix_updated"
        
        response_two = test_client.get("/forwarder/1")
        assert response.json() == response_two.json()
        
def test_delete_address(test_client):
    response = test_client.delete("/address/1")
    
    assert response.status_code == 200
    
    response_two = test_client.get("/address/1")
    
    assert response_two.status_code == 404


def test_delete_forwarder(test_client):
    response = test_client.delete("/forwarder/1")
    
    assert response.status_code == 200
    
    response_two = test_client.get("/forwarder/1")
    
    assert response_two.status_code == 404