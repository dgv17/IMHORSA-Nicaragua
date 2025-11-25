DROP DATABASE IF EXISTS `imhorsa`;
CREATE DATABASE `imhorsa`;
USE `imhorsa`;
-- 1) Ubicaciones
CREATE TABLE departamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE municipios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  departamento_id INT NOT NULL,
  nombre VARCHAR(30) NOT NULL,
  FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE direcciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  municipio_id INT NOT NULL,
  direccion VARCHAR(100) NOT NULL,
  FOREIGN KEY (municipio_id) REFERENCES municipios(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 2) Clientes (natural / juridico)
CREATE TABLE cliente_natural (
  id INT AUTO_INCREMENT PRIMARY KEY,
  direccion_id INT NULL,
  primer_nombre VARCHAR(15) NOT NULL,
  segundo_nombre VARCHAR(15),
  primer_apellido VARCHAR(15) NOT NULL,
  segundo_apellido VARCHAR(15),
  cedula VARCHAR(16) UNIQUE,
  telefono VARCHAR(8),
  correo VARCHAR(50),
  FOREIGN KEY (direccion_id) REFERENCES direcciones(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cliente_juridico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  direccion_id INT NULL,
  nombre VARCHAR(20) NOT NULL,
  correo VARCHAR(50),
  FOREIGN KEY (direccion_id) REFERENCES direcciones(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Tabla "clientes" que referencia a natural o juridico según tipo
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('natural','juridico') NOT NULL,
  natural_id INT NULL,
  juridico_id INT NULL,
  FOREIGN KEY (natural_id) REFERENCES cliente_natural(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (juridico_id) REFERENCES cliente_juridico(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 3) Productos: series, modelos, vehículos y accesorios
CREATE TABLE series (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(15) NOT NULL,
  marca VARCHAR(15)
) ENGINE=InnoDB;

CREATE TABLE modelos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  serie_id INT NOT NULL,
  nombre VARCHAR(30) NOT NULL,
  anio YEAR NULL,
  estado VARCHAR(15),
  FOREIGN KEY (serie_id) REFERENCES series(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE vehiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  modelo_id INT NOT NULL,
  stock TINYINT(1) NOT NULL DEFAULT 1, -- 1 = hay stock, 0 = no hay stock 
  precio DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (modelo_id) REFERENCES modelos(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE accesorios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  series_id INT NULL,
  nombre VARCHAR(60) NOT NULL,
  stock TINYINT(1) NOT NULL DEFAULT 1,
  precio DECIMAL(12,2) NOT NULL,
  descripcion TEXT,
  FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4) Cotizaciones y tablas por tipo
CREATE TABLE cotizaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero_factura VARCHAR(20) UNIQUE NULL,
  cliente_id INT NOT NULL,
  fecha_solicitud DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tipo ENUM('vehiculo','accesorio','renta_evento','mantenimiento') NOT NULL,
  estado ENUM('En proceso','Aceptada','Denegada') NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Cotización de vehículos (PK compuesta)
CREATE TABLE cotizacion_vehiculo (
  cotizacion_id INT NOT NULL,
  vehiculo_id INT NOT NULL,
  PRIMARY KEY (cotizacion_id, vehiculo_id),
  FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Cotización de accesorios (PK compuesta)
CREATE TABLE cotizacion_accesorio (
  cotizacion_id INT NOT NULL,
  accesorio_id INT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  PRIMARY KEY (cotizacion_id, accesorio_id),
  FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (accesorio_id) REFERENCES accesorios(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Renta de eventos (1-1 con cotizacion)
CREATE TABLE renta_eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cotizacion_id INT NOT NULL UNIQUE,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  cantidad INT NOT NULL,
  FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Solicitud de mantenimiento (1-1 con cotizacion)
CREATE TABLE solicitud_mantenimiento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cotizacion_id INT NOT NULL UNIQUE,
  modelo_id INT NOT NULL,
  problema TEXT NOT NULL,
  FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (modelo_id) REFERENCES modelos(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5) Usuarios, roles y permisos (RBAC)
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(25) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE permisos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(25) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE rol_permiso (
  rol_id INT NOT NULL,
  permiso_id INT NOT NULL,
  PRIMARY KEY (rol_id, permiso_id),
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(25) NOT NULL UNIQUE,
  password_user VARBINARY(256) NOT NULL,
  nombre VARCHAR(25),
  correo VARCHAR(50),
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rol_id INT NOT NULL,
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE restore_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;


select*from direcciones;
select*from municipios;
select*from accesorios;
select*from cotizaciones;
select*from clientes join cliente_juridico;

select*from rol_permiso;
select*from roles