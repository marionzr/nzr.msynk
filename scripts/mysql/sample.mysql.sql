CREATE TABLE IF NOT EXISTS task(
  id INT AUTO_INCREMENT NOT NULL,
  team_id SMALLINT NOT NULL,
  info VARCHAR(255),
  filter VARCHAR(255),
  PRIMARY KEY(id, team_id)
);

CREATE TABLE IF NOT EXISTS msy_task (
  id INT NOT NULL,
  team_id SMALLINT NOT NULL,
  operation CHAR(1) NOT NULL DEFAULT 'i',
  version SMALLINT NOT NULL DEFAULT 1,  
  PRIMARY KEY(id, team_id)
);

DROP TRIGGER msy_tg_i_task;
CREATE TRIGGER msy_tg_i_task AFTER INSERT ON task 
FOR EACH ROW	
BEGIN
    INSERT INTO msy_task (id, team_id, operation, version) VALUES (NEW.id, NEW.team_id, 'i', 1)
    ON DUPLICATE KEY UPDATE operation = 'i', version = version + 1;
END;

DROP TRIGGER msy_tg_u_task;
CREATE TRIGGER msy_tg_u_task AFTER UPDATE ON task 
FOR EACH ROW	
BEGIN
    INSERT INTO msy_task (id, team_id, operation, version) VALUES (NEW.id, NEW.team_id, 'u', 1)
    ON DUPLICATE KEY UPDATE operation = 'u', version = version + 1;
END;

DROP TRIGGER msy_tg_d_task;
CREATE TRIGGER msy_tg_d_task AFTER DELETE ON task 
FOR EACH ROW	
BEGIN
    INSERT INTO msy_task (id, team_id, operation, version) VALUES (OLD.id, OLD.team_id, 'd', 1)
    ON DUPLICATE KEY UPDATE operation = 'd', version = version + 1;
END;

CREATE TABLE IF NOT EXISTS team(
    id SMALLINT NOT NULL PRIMARY KEY,
    device_serial_number VARCHAR(255)   
);