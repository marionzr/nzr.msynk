SELECT c.version AS $VERSION$, t.*
FROM task AS t
LEFT JOIN msy_task c
ON t.id = c.id AND t.team_id = c.team_id 
WHERE c.version IS NULL OR c.version > 0

SELECT c.version AS $VERSION$, t.*
FROM task AS t
LEFT JOIN msy_task c 
ON t.id = c.id AND t.team_id = c.team_id 
WHERE c.version IS NULL OR c.version > 0
AND $FILTER$;

SHOW FULL TABLES WHERE table_type = 'BASE TABLE' AND Tables_in_msync NOT LIKE '%msy_%';
DESCRIBE task

select * from msy_table_config
delete from msy_Table_config

DESCRIBE task;
SHOW COLUMNS FROM TASK
SHOW TABLE STATUS FROM ms

CREATE TABLE a (
    id INT(11)
)

SELECT CONCAT('DROP TRIGGER ', trigger_name, ';') FROM information_schema.triggers
WHERE trigger_name LIKE 'msy_%'

DROP TRIGGER msy_tg_i_a;
DROP TRIGGER msy_tg_i_task;
DROP TRIGGER msy_tg_i_team;
DROP TRIGGER msy_tg_u_a;
DROP TRIGGER msy_tg_u_task;
DROP TRIGGER msy_tg_u_team;
DROP TRIGGER msy_tg_d_a;
DROP TRIGGER msy_tg_d_task;
DROP TRIGGER msy_tg_d_team;


SELECT CONCAT('DROP TABLE ', table_name, ';') FROM information_schema.tables
WHERE table_type = 'BASE TABLE' AND (table_name LIKE 'msy_%' AND table_name NOT IN ('msy_config', 'msy_device', 'msy_sync_history', 'msy_table_config'))


DROP TABLE msy_a;
DROP TABLE msy_task;
DROP TABLE msy_team;

SELECT * FROM information_schema.tables
WHERE table_type = 'BASE TABLE' AND table_name LIKE 'msy_%'
--2017-12-04 15:26:56
SELECT * FROM MSY_CONFIG
INSERT INTO msy_config VALUES (1, 'ignore_tables', 'a');

CREATE TABLE a (
    id int primary key
)