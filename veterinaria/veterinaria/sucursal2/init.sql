create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create user admin1 with password 'admin123';
create user consulta with password 'consulta123';

-- Otorgar permisos al usuario de escritura (admin1)
GRANT CONNECT ON DATABASE veterinaria2 TO admin1;
GRANT USAGE ON SCHEMA public TO admin1;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin1;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin1;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO admin1;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO admin1;

-- Otorgar permisos de lectura al usuario de lectura (consulta)
GRANT CONNECT ON DATABASE veterinaria2 TO consulta;
GRANT USAGE ON SCHEMA public TO consulta;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO consulta;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO consulta;

create table mascota (
    id uuid primary key default uuid_generate_v4(),
    nombre varchar(255) not null
);

create table veterinario (
    id uuid primary key default uuid_generate_v4(),
    nombre varchar(255) not null
);

create table tratamiento (
    id uuid primary key default uuid_generate_v4(),
    descripcion varchar(255) not null
);

create table cita (
    id uuid primary key default uuid_generate_v4(),
    mascota_id uuid references mascota(id) not null,
    fecha date not null
);

create table historial (
    id uuid primary key default uuid_generate_v4(),
    mascota_id uuid references mascota(id) not null,
    descripcion varchar(255) not null
);