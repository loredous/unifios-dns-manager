from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # REQUIRED SETTINGS
    api_port: str
    # OPTIONAL SETTINGS
    api_listen_address: str = "0.0.0.0"
    db_connection_string: str = "sqlite:///dnsmanager.db"
    dns_config_file:str = "/run/dnsmasq.conf.d/99-unifios-dns-manager.conf"
    dns_refresh_interval: int = 300
    dnsmasq_pid_file: str = "/run/dnsmasq.pid"