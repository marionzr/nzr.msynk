CREATE TABLE IF NOT EXISTS task(
  id INTEGER,
  team_id INTEGER,
  info TEXT,
  filter TEXT,
  PRIMARY_KEY (id, team_id ASC)
);

CREATE TABLE IF NOT EXISTS msy_task (
  id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  operation TEXT NOT NULL DEFAULT 'i',
  version INTEGER NOT NULL DEFAULT 1, 
  synced TEXT NOT NULL DEFAULT 'Y', 
  PRIMARY KEY(id, team_id)
);

DROP TRIGGER msy_tg_i_task;
CREATE TRIGGER msy_tg_i_task AFTER INSERT ON task 
FOR EACH ROW	
BEGIN
    INSERT OR REPLACE INTO msy_task (id, team_id, operation, version) VALUES (NEW.id, NEW.team_id, 'i', 
	(SELECT IFNULL(version, 0) + 1 FROM msy_task WHERE id = NEW.id AND team_id = NEW.team_id));
END;

DROP TRIGGER msy_tg_u_task;
CREATE TRIGGER msy_tg_u_task AFTER UPDATE ON task 
FOR EACH ROW	
BEGIN
    INSERT OR REPLACE INTO msy_task (id, team_id, operation, version) VALUES (NEW.id, NEW.team_id, 'u', 
	(SELECT IFNULL(version, 0) + 1 FROM msy_task WHERE id = NEW.id AND team_id = NEW.team_id));
END;

DROP TRIGGER msy_tg_d_task;
CREATE TRIGGER msy_tg_d_task AFTER DELETE ON task 
FOR EACH ROW
BEGIN	
    INSERT OR REPLACE INTO msy_task (id, team_id, operation, version) VALUES (OLD.id, OLD.team_id, 'u', 
	(SELECT IFNULL(version, 0) + 1 FROM msy_task WHERE id = OLD.id AND team_id = OLD.team_id));
END;