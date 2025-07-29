---Aqui va a ir las configuraciones del symmetricDS

select * from sym_node_group_link; --cambiar de 0 a 1 en la columna de isreversible

--enrutar la tabla mascota de forma bidireccional
INSERT INTO sym_router (
    router_id, 
    source_node_group_id, 
    target_node_group_id, 
    router_type, 
    create_time, 
    last_update_time
) VALUES
('sucursal1-sucursal2', 'sucursal1-node', 'sucursal2-node', 'default', current_timestamp, current_timestamp),
('sucursal2-sucursal1', 'sucursal2-node', 'sucursal1-node', 'default', current_timestamp, current_timestamp);

INSERT INTO sym_trigger (
    trigger_id, 
    source_table_name, 
    channel_id, 
    sync_on_insert, 
    sync_on_update, 
    sync_on_delete, 
    create_time, 
    last_update_time
) VALUES
('mascota_trigger', 'mascota', 'default', 1, 1, 1, current_timestamp, current_timestamp);

INSERT INTO sym_trigger_router (
    trigger_id, 
    router_id, 
    enabled, 
    initial_load_order, 
    create_time, 
    last_update_time
) VALUES
('mascota_trigger', 'sucursal1-sucursal2', 1, 1, current_timestamp, current_timestamp),
('mascota_trigger', 'sucursal2-sucursal1', 1, 1, current_timestamp, current_timestamp);


--enrutar la tabla veterinario de forma bidireccional
INSERT INTO sym_router (
    router_id, 
    source_node_group_id, 
    target_node_group_id, 
    router_type, 
    create_time, 
    last_update_time
) VALUES
('sucursal1-sucursal2', 'sucursal1-node', 'sucursal2-node', 'default', current_timestamp, current_timestamp),
('sucursal2-sucursal1', 'sucursal2-node', 'sucursal1-node', 'default', current_timestamp, current_timestamp);

INSERT INTO sym_trigger (
    trigger_id, 
    source_table_name, 
    channel_id, 
    sync_on_insert, 
    sync_on_update, 
    sync_on_delete, 
    create_time, 
    last_update_time
) VALUES
('veterinario_trigger', 'veterinario', 'default', 1, 1, 1, current_timestamp, current_timestamp);

INSERT INTO sym_trigger_router (
    trigger_id, 
    router_id, 
    enabled, 
    initial_load_order, 
    create_time, 
    last_update_time
) VALUES
('veterinario_trigger', 'sucursal1-sucursal2', 1, 1, current_timestamp, current_timestamp),
('veterinario_trigger', 'sucursal2-sucursal1', 1, 1, current_timestamp, current_timestamp);

--enrutar la tabla tratamiento de forma bidireccional
INSERT INTO sym_trigger (
    trigger_id, 
    source_table_name, 
    channel_id, 
    sync_on_insert, 
    sync_on_update, 
    sync_on_delete, 
    create_time, 
    last_update_time
) VALUES
('tratamiento_trigger', 'tratamiento', 'default', 1, 1, 1, current_timestamp, current_timestamp);

INSERT INTO sym_trigger_router (
    trigger_id, 
    router_id, 
    enabled, 
    initial_load_order, 
    create_time, 
    last_update_time
) VALUES
('tratamiento_trigger', 'sucursal1-sucursal2', 1, 1, current_timestamp, current_timestamp),
('tratamiento_trigger', 'sucursal2-sucursal1', 1, 1, current_timestamp, current_timestamp);



SELECT m.nombre AS mascota, t.descripcion AS tratamiento
FROM mascota m
JOIN LATERAL (
	SELECT *
	  FROM dblink(
	    'host=pg-sucursal1 port=5432 dbname=veterinaria user=postgres password=postgres',
	    'SELECT * FROM tratamiento'
	  ) AS t(id UUID, descripcion VARCHAR)
) t ON true;

