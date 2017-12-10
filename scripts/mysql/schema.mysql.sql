CREATE DATABASE msync;

CREATE TABLE IF NOT EXISTS msy_device (
  id SMALLINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  enabled CHAR(1) NOT NULL DEFAULT 'Y',
  password VARCHAR(255) NOT NULL,
  device varchar(255)
);

CREATE UNIQUE INDEX msy_ix_device_name ON msy_device(name);

CREATE TABLE IF NOT EXISTS msy_config (
  id SMALLINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  value VARCHAR(255) NOT NULL
);

CREATE UNIQUE INDEX msy_ix_config_name ON msy_config(name);

CREATE TABLE IF NOT EXISTS msy_sync_history (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  device_id SMALLINT NOT NULL,
  event CHAR(1) NOT NULL DEFAULT 'B',
  event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX msy_ix_sync_history_event_time ON msy_sync_history(event_time);
CREATE INDEX msy_ix_sync_history_device_id ON msy_sync_history(device_id);

CREATE TABLE IF NOT EXISTS msy_table_config (
    tab_name VARCHAR(255) PRIMARY KEY,
    version INT NOT NULL DEFAULT 1,
    device_filter VARCHAR(255) NOT NULL,
    sync_order SMALLINT NOT NULL,
    enabled CHAR(1) NOT NULL DEFAULT 'Y',
    on_insert_conflict CHAR(1) NOT NULL DEFAULT 'D',
    on_update_conflict CHAR(1) NOT NULL DEFAULT 'D',
    on_delete_conflict CHAR(1) NOT NULL DEFAULT 'S'
 );

 
CREATE UNIQUE INDEX msy_uk_table_config_sync_order ON msy_table_config(sync_order);