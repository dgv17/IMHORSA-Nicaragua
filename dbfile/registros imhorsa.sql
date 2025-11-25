USE `imhorsa`;
INSERT INTO departamentos (nombre) VALUES
('Boaco'),
('Carazo'),
('Chinandega'),
('Chontales'),
('Estelí'),
('Granada'),
('Jinotega'),
('León'),
('Madriz'),
('Managua'),
('Masaya'),
('Matagalpa'),
('Nueva Segovia'),
('Río San Juan'),
('Rivas'),
('Costa Caribe Norte'),
('Costa Caribe Sur');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='Boaco'), 'Boaco'),
((SELECT id FROM departamentos WHERE nombre='Boaco'), 'Camoapa'),
((SELECT id FROM departamentos WHERE nombre='Boaco'), 'San Lorenzo'),
((SELECT id FROM departamentos WHERE nombre='Boaco'), 'Santa Lucía'),
((SELECT id FROM departamentos WHERE nombre='Boaco'), 'Teustepe'),
((SELECT id FROM departamentos WHERE nombre='Boaco'), 'San José de los Remates');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='Carazo'), 'Jinotepe'),
((SELECT id FROM departamentos WHERE nombre='Carazo'), 'Diriamba'),
((SELECT id FROM departamentos WHERE nombre='Carazo'), 'San Marcos'),
((SELECT id FROM departamentos WHERE nombre='Carazo'), 'Dolores'),
((SELECT id FROM departamentos WHERE nombre='Carazo'), 'La Paz de Carazo'),
((SELECT id FROM departamentos WHERE nombre='Carazo'), 'Santa Teresa'),
((SELECT id FROM departamentos WHERE nombre='Carazo'), 'El Rosario'),
((SELECT id FROM departamentos WHERE nombre='Carazo'), 'La Conquista');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='Chinandega'), 'Chinandega'),
((SELECT id FROM departamentos WHERE nombre='Chinandega'), 'El Viejo'),
((SELECT id FROM departamentos WHERE nombre='Chinandega'), 'Corinto'),
((SELECT id FROM departamentos WHERE nombre='Chinandega'), 'Chichigalpa'),
((SELECT id FROM departamentos WHERE nombre='Chinandega'), 'Posoltega'),
((SELECT id FROM departamentos WHERE nombre='Chinandega'), 'El Realejo'),
((SELECT id FROM departamentos WHERE nombre='Chinandega'), 'Puerto Morazán'),
((SELECT id FROM departamentos WHERE nombre='Chinandega'), 'Somotillo'),
((SELECT id FROM departamentos WHERE nombre='Chinandega'), 'Villanueva'),
((SELECT id FROM departamentos WHERE nombre='Chinandega'), 'San Pedro del Norte'),
((SELECT id FROM departamentos WHERE nombre='Chinandega'), 'Santo Tomás del Norte'),
((SELECT id FROM departamentos WHERE nombre='Chinandega'), 'Cinco Pinos'),
((SELECT id FROM departamentos WHERE nombre='Chinandega'), 'San Francisco del Norte');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='Chontales'), 'Juigalpa'),
((SELECT id FROM departamentos WHERE nombre='Chontales'), 'Acoyapa'),
((SELECT id FROM departamentos WHERE nombre='Chontales'), 'Comalapa'),
((SELECT id FROM departamentos WHERE nombre='Chontales'), 'San Pedro de Lóvago'),
((SELECT id FROM departamentos WHERE nombre='Chontales'), 'La Libertad'),
((SELECT id FROM departamentos WHERE nombre='Chontales'), 'Santo Tomás'),
((SELECT id FROM departamentos WHERE nombre='Chontales'), 'Villa Sandino'),
((SELECT id FROM departamentos WHERE nombre='Chontales'), 'El Coral'),
((SELECT id FROM departamentos WHERE nombre='Chontales'), 'San Francisco de Cuapa'),
((SELECT id FROM departamentos WHERE nombre='Chontales'), 'Santo Domingo');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='Estelí'), 'Estelí'),
((SELECT id FROM departamentos WHERE nombre='Estelí'), 'Condega'),
((SELECT id FROM departamentos WHERE nombre='Estelí'), 'Pueblo Nuevo'),
((SELECT id FROM departamentos WHERE nombre='Estelí'), 'La Trinidad'),
((SELECT id FROM departamentos WHERE nombre='Estelí'), 'San Nicolás'),
((SELECT id FROM departamentos WHERE nombre='Estelí'), 'San Juan de Limay');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='Granada'), 'Granada'),
((SELECT id FROM departamentos WHERE nombre='Granada'), 'Nandaime'),
((SELECT id FROM departamentos WHERE nombre='Granada'), 'Diriá'),
((SELECT id FROM departamentos WHERE nombre='Granada'), 'Diriomo');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='Jinotega'), 'Jinotega'),
((SELECT id FROM departamentos WHERE nombre='Jinotega'), 'San Rafael del Norte'),
((SELECT id FROM departamentos WHERE nombre='Jinotega'), 'San Sebastián de Yalí'),
((SELECT id FROM departamentos WHERE nombre='Jinotega'), 'La Concordia'),
((SELECT id FROM departamentos WHERE nombre='Jinotega'), 'San José de Bocay'),
((SELECT id FROM departamentos WHERE nombre='Jinotega'), 'El Cuá'),
((SELECT id FROM departamentos WHERE nombre='Jinotega'), 'Santa María de Pantasma'),
((SELECT id FROM departamentos WHERE nombre='Jinotega'), 'Wiwilí de Jinotega');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='León'), 'León'),
((SELECT id FROM departamentos WHERE nombre='León'), 'Nagarote'),
((SELECT id FROM departamentos WHERE nombre='León'), 'La Paz Centro'),
((SELECT id FROM departamentos WHERE nombre='León'), 'Telica'),
((SELECT id FROM departamentos WHERE nombre='León'), 'Quezalguaque'),
((SELECT id FROM departamentos WHERE nombre='León'), 'El Sauce'),
((SELECT id FROM departamentos WHERE nombre='León'), 'Achuapa'),
((SELECT id FROM departamentos WHERE nombre='León'), 'Santa Rosa del Peñón'),
((SELECT id FROM departamentos WHERE nombre='León'), 'El Jicaral'),
((SELECT id FROM departamentos WHERE nombre='León'), 'Malpaisillo');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='Madriz'), 'Somoto'),
((SELECT id FROM departamentos WHERE nombre='Madriz'), 'San Juan de Río Coco'),
((SELECT id FROM departamentos WHERE nombre='Madriz'), 'Telpaneca'),
((SELECT id FROM departamentos WHERE nombre='Madriz'), 'Palacagüina'),
((SELECT id FROM departamentos WHERE nombre='Madriz'), 'Yalagüina'),
((SELECT id FROM departamentos WHERE nombre='Madriz'), 'Totogalpa'),
((SELECT id FROM departamentos WHERE nombre='Madriz'), 'San Lucas'),
((SELECT id FROM departamentos WHERE nombre='Madriz'), 'Las Sabanas'),
((SELECT id FROM departamentos WHERE nombre='Madriz'), 'San José de Cusmapa');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='Managua'), 'Managua'),
((SELECT id FROM departamentos WHERE nombre='Managua'), 'Mateare'),
((SELECT id FROM departamentos WHERE nombre='Managua'), 'San Rafael del Sur'),
((SELECT id FROM departamentos WHERE nombre='Managua'), 'Tipitapa'),
((SELECT id FROM departamentos WHERE nombre='Managua'), 'Villa El Carmen'),
((SELECT id FROM departamentos WHERE nombre='Managua'), 'El Crucero'),
((SELECT id FROM departamentos WHERE nombre='Managua'), 'Ticuantepe'),
((SELECT id FROM departamentos WHERE nombre='Managua'), 'Ciudad Sandino'),
((SELECT id FROM departamentos WHERE nombre='Managua'), 'San Francisco Libre');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='Masaya'), 'Masaya'),
((SELECT id FROM departamentos WHERE nombre='Masaya'), 'Nandasmo'),
((SELECT id FROM departamentos WHERE nombre='Masaya'), 'Niquinohomo'),
((SELECT id FROM departamentos WHERE nombre='Masaya'), 'Catarina'),
((SELECT id FROM departamentos WHERE nombre='Masaya'), 'San Juan de Oriente'),
((SELECT id FROM departamentos WHERE nombre='Masaya'), 'Tisma'),
((SELECT id FROM departamentos WHERE nombre='Masaya'), 'La Concepción'),
((SELECT id FROM departamentos WHERE nombre='Masaya'), 'Masatepe'),
((SELECT id FROM departamentos WHERE nombre='Masaya'), 'Nindirí');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='Matagalpa'), 'Matagalpa'),
((SELECT id FROM departamentos WHERE nombre='Matagalpa'), 'San Ramón'),
((SELECT id FROM departamentos WHERE nombre='Matagalpa'), 'San Isidro'),
((SELECT id FROM departamentos WHERE nombre='Matagalpa'), 'Sébaco'),
((SELECT id FROM departamentos WHERE nombre='Matagalpa'), 'Ciudad Darío'),
((SELECT id FROM departamentos WHERE nombre='Matagalpa'), 'Terrabona'),
((SELECT id FROM departamentos WHERE nombre='Matagalpa'), 'Esquipulas'),
((SELECT id FROM departamentos WHERE nombre='Matagalpa'), 'San Dionisio'),
((SELECT id FROM departamentos WHERE nombre='Matagalpa'), 'El Tuma-La Dalia'),
((SELECT id FROM departamentos WHERE nombre='Matagalpa'), 'Río Blanco'),
((SELECT id FROM departamentos WHERE nombre='Matagalpa'), 'Rancho Grande'),
((SELECT id FROM departamentos WHERE nombre='Matagalpa'), 'La Paíla'),
((SELECT id FROM departamentos WHERE nombre='Matagalpa'), 'Muy Muy');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='Nueva Segovia'), 'Ocotal'),
((SELECT id FROM departamentos WHERE nombre='Nueva Segovia'), 'Dipilto'),
((SELECT id FROM departamentos WHERE nombre='Nueva Segovia'), 'Macuelizo'),
((SELECT id FROM departamentos WHERE nombre='Nueva Segovia'), 'Mozonte'),
((SELECT id FROM departamentos WHERE nombre='Nueva Segovia'), 'Santa María'),
((SELECT id FROM departamentos WHERE nombre='Nueva Segovia'), 'Ciudad Antigua'),
((SELECT id FROM departamentos WHERE nombre='Nueva Segovia'), 'El Jícaro'),
((SELECT id FROM departamentos WHERE nombre='Nueva Segovia'), 'Murra'),
((SELECT id FROM departamentos WHERE nombre='Nueva Segovia'), 'Quilalí'),
((SELECT id FROM departamentos WHERE nombre='Nueva Segovia'), 'San Fernando'),
((SELECT id FROM departamentos WHERE nombre='Nueva Segovia'), 'Wiwilí de Nueva Segovia'),
((SELECT id FROM departamentos WHERE nombre='Nueva Segovia'), 'Jalapa');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='Río San Juan'), 'San Carlos'),
((SELECT id FROM departamentos WHERE nombre='Río San Juan'), 'El Castillo'),
((SELECT id FROM departamentos WHERE nombre='Río San Juan'), 'San Miguelito'),
((SELECT id FROM departamentos WHERE nombre='Río San Juan'), 'Morrito'),
((SELECT id FROM departamentos WHERE nombre='Río San Juan'), 'El Almendro'),
((SELECT id FROM departamentos WHERE nombre='Río San Juan'), 'San Juan del Norte');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='Rivas'), 'Rivas'),
((SELECT id FROM departamentos WHERE nombre='Rivas'), 'San Jorge'),
((SELECT id FROM departamentos WHERE nombre='Rivas'), 'Buenos Aires'),
((SELECT id FROM departamentos WHERE nombre='Rivas'), 'Potosí'),
((SELECT id FROM departamentos WHERE nombre='Rivas'), 'Tola'),
((SELECT id FROM departamentos WHERE nombre='Rivas'), 'Belén'),
((SELECT id FROM departamentos WHERE nombre='Rivas'), 'Pueblo Nuevo'),
((SELECT id FROM departamentos WHERE nombre='Rivas'), 'Cárdenas'),
((SELECT id FROM departamentos WHERE nombre='Rivas'), 'San Juan del Sur'),
((SELECT id FROM departamentos WHERE nombre='Rivas'), 'Altagracia');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Norte'), 'Puerto Cabezas'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Norte'), 'Waspam'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Norte'), 'Rosita'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Norte'), 'Bonanza'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Norte'), 'Siuna'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Norte'), 'Mulukukú'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Norte'), 'Prinzapolka'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Norte'), 'Waslala'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Norte'), 'Bilwi'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Norte'), 'Sandy Bay'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Norte'), 'Krukira'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Norte'), 'Haulover');

INSERT INTO municipios (departamento_id, nombre) VALUES
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Sur'), 'Bluefields'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Sur'), 'Corn Island'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Sur'), 'Desembocadura de Río Grande'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Sur'), 'La Cruz de Río Grande'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Sur'), 'El Ayote'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Sur'), 'Nueva Guinea'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Sur'), 'Kukra Hill'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Sur'), 'Laguna de Perlas'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Sur'), 'El Tortuguero'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Sur'), 'Paiwas'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Sur'), 'Bocana de Paiwas'),
((SELECT id FROM departamentos WHERE nombre='Costa Caribe Sur'), 'San Pedro del Norte');

INSERT INTO series (nombre, marca) VALUES
('D-Max', 'Evolution'),
('D5', 'Evolution'),
('D2', 'Evolution'),
('Golf', 'Evolution'),
('Commercial', 'Evolution'),
('Personal', 'Evolution');

INSERT INTO modelos (serie_id, nombre, anio, estado) VALUES
((SELECT id FROM series WHERE nombre='D-Max'),'GT4', 2026, 'Activo'),
((SELECT id FROM series WHERE nombre='D-Max'),'GT6', 2026, 'Activo'),
((SELECT id FROM series WHERE nombre='D-Max'),'XT4', 2026, 'Activo'),
((SELECT id FROM series WHERE nombre='D-Max'),'XT6', 2026, 'Activo'),
((SELECT id FROM series WHERE nombre='D5'),'Ranger 2+2 PLUS', 2025, 'Activo'),
((SELECT id FROM series WHERE nombre='D5'),'Maverick 2+2 PLUS', 2025, 'Activo'),
((SELECT id FROM series WHERE nombre='D5'),'Ranger 4 PLUS', 2025, 'Activo'),
((SELECT id FROM series WHERE nombre='D5'),'Maverick 4 PLUS', 2025, 'Activo'),
((SELECT id FROM series WHERE nombre='D5'),'Ranger 6 PLUS', 2025, 'Activo'),
((SELECT id FROM series WHERE nombre='D5'),'Maverick 6 PLUS', 2025, 'Activo'),
((SELECT id FROM series WHERE nombre='D5'),'Ranger 4+2 PLUS', 2025, 'Activo'),
((SELECT id FROM series WHERE nombre='D5'),'Maverick 4+2 PLUS', 2025, 'Activo'),
((SELECT id FROM series WHERE nombre='D5'), 'Ranger 2+2', 2025, 'Activo'),
((SELECT id FROM series WHERE nombre='D5'), 'Maverick 2+2', 2025, 'Activo'),
((SELECT id FROM series WHERE nombre='D5'), 'Ranger 4', 2025, 'Activo'),
((SELECT id FROM series WHERE nombre='D5'), 'Maverick 4', 2025, 'Activo'),
((SELECT id FROM series WHERE nombre='D5'), 'Ranger 6', 2025, 'Activo'),
((SELECT id FROM series WHERE nombre='D5'), 'Maverick 6', 2025, 'Activo'),
((SELECT id FROM series WHERE nombre='Golf'), 'Classic 2 PLUS', 2022, 'Descontinuado'),
((SELECT id FROM series WHERE nombre='Golf'), 'Classic 4 PLUS', 2023, 'Activo'),
((SELECT id FROM series WHERE nombre='Golf'), 'Carrier 6 PLUS', 2024, 'Descontinuado'),
((SELECT id FROM series WHERE nombre='Commercial'), 'Turfman 200 PLUS', 2024, 'Activo'),
((SELECT id FROM series WHERE nombre='Commercial'), 'Turfman 800 PLUS', 2024, 'Activo'),
((SELECT id FROM series WHERE nombre='Commercial'), 'Turfman 1000 PLUS', 2024, 'Activo'),
((SELECT id FROM series WHERE nombre='Commercial'), 'Carrier 8 PLUS', 2025, 'Descontinuado'),
((SELECT id FROM series WHERE nombre='Personal'), 'Forester 4 PLUS', 2024, 'Activo'),
((SELECT id FROM series WHERE nombre='Personal'), 'Forester 6 PLUS', 2024, 'Activo'),
((SELECT id FROM series WHERE nombre='Personal'), 'Carrier 6 PLUS', 2024, 'Activo');

INSERT INTO vehiculos (modelo_id, stock, precio) VALUES
((SELECT id FROM modelos WHERE nombre='GT4' AND serie_id=(SELECT id FROM series WHERE nombre='D-MAX')), 1, 13595*36.66),
((SELECT id FROM modelos WHERE nombre='GT6' AND serie_id=(SELECT id FROM series WHERE nombre='D-MAX')), 1, 15595*36.66),
((SELECT id FROM modelos WHERE nombre='XT4' AND serie_id=(SELECT id FROM series WHERE nombre='D-MAX')), 1, 15595*36.66),
((SELECT id FROM modelos WHERE nombre='XT6' AND serie_id=(SELECT id FROM series WHERE nombre='D-MAX')), 1, 17595*36.66),
((SELECT id FROM modelos WHERE nombre='Ranger 2+2 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='D5')), 1, 8695*36.66),
((SELECT id FROM modelos WHERE nombre='Maverick 2+2 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='D5')), 1, 8995*36.66),
((SELECT id FROM modelos WHERE nombre='Ranger 4 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='D5')), 1, 9595*36.66),
((SELECT id FROM modelos WHERE nombre='Maverick 4 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='D5')), 1, 9995*36.66),
((SELECT id FROM modelos WHERE nombre='Ranger 6 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='D5')), 1, 11595*36.66),
((SELECT id FROM modelos WHERE nombre='Maverick 6 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='D5')), 1, 11995*36.66),
((SELECT id FROM modelos WHERE nombre='Ranger 4+2 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='D5')), 1, 11595*36.66),
((SELECT id FROM modelos WHERE nombre='Maverick 4+2 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='D5')), 1, 11995*36.66),
((SELECT id FROM modelos WHERE nombre='Ranger 2+2' AND serie_id=(SELECT id FROM series WHERE nombre='D5')), 1, 7695*36.66),
((SELECT id FROM modelos WHERE nombre='Maverick 2+2' AND serie_id=(SELECT id FROM series WHERE nombre='D5')), 1, 7995*36.66),
((SELECT id FROM modelos WHERE nombre='Ranger 4' AND serie_id=(SELECT id FROM series WHERE nombre='D5')), 1, 8695*36.66),
((SELECT id FROM modelos WHERE nombre='Maverick 4' AND serie_id=(SELECT id FROM series WHERE nombre='D5')), 1, 8995*36.66),
((SELECT id FROM modelos WHERE nombre='Ranger 6' AND serie_id=(SELECT id FROM series WHERE nombre='D5')), 1, 10595*36.66),
((SELECT id FROM modelos WHERE nombre='Maverick 6' AND serie_id=(SELECT id FROM series WHERE nombre='D5')), 1, 10995*36.66),
((SELECT id FROM modelos WHERE nombre='Classic 2 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='Golf')), 1, 6695*36.66),
((SELECT id FROM modelos WHERE nombre='Classic 4 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='Golf')), 1, 6795*36.66),
((SELECT id FROM modelos WHERE nombre='Carrier 6 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='Golf')), 1, 9595*36.66),
((SELECT id FROM modelos WHERE nombre='Turfman 200 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='Commercial')), 1, 6795*36.66),
((SELECT id FROM modelos WHERE nombre='Turfman 800 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='Commercial')), 1, 9995*36.66),
((SELECT id FROM modelos WHERE nombre='Turfman 1000 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='Commercial')), 1, 9995*36.66),
((SELECT id FROM modelos WHERE nombre='Carrier 8 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='Commercial')), 1, 13995*36.66),
((SELECT id FROM modelos WHERE nombre='Forester 4 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='Personal')), 1, 6995*36.66),
((SELECT id FROM modelos WHERE nombre='Forester 6 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='Personal')), 1, 9995*36.66),
((SELECT id FROM modelos WHERE nombre='Carrier 6 PLUS' AND serie_id=(SELECT id FROM series WHERE nombre='Personal')), 1, 9595*36.66);

INSERT INTO accesorios (series_id, nombre, stock, precio,descripcion) VALUES
((SELECT id FROM series WHERE nombre='D5'), 'Cubierto contra la lluvia', 1, 559*36.66,'Aumente el atractivo de su carrito de golf con la refinada cubierta contra la lluvia Evolution, diseñada meticulosamente para configuraciones D5 de 4 o 6 asientos (todos orientados hacia adelante). Fabricada con finas telas de gasa, la cubierta ofrece detalles de alta definición y bordes precisos.'),
((SELECT id FROM series WHERE nombre='D5'), 'Soporte para bolsas de golf', 1, 89*36.66,'El soporte negro para bolsas de golf, cuidadosamente diseñado para integrarse a la perfección con la parte trasera de su carrito de golf Evolution, cuenta con correas elásticas resistentes que aseguran la sujeción firme de hasta dos bolsas de golf, ofreciendo estilo y funcionalidad mientras recorre el campo.'),
((SELECT id FROM series WHERE nombre='D5'), 'Soporte para tarjetas de puntuación montado en el techo', 1, 55*36.66,'Portatarjetas de techo (blanco, beige). Se fija al techo de su carrito de golf Evolution y se puede montar con o sin taladro. Úselo para la tarjeta de puntuación de los pasajeros o para la tarjeta de grupo en los modelos de la serie D5.'),
((SELECT id FROM series WHERE nombre='D2'), 'Accesorio para bolsa de golf con kit de botella de arena', 1, 300*36.66,'Mejora tu juego con el accesorio para bolsa de golf Evolution, que incluye un kit para la botella de arena. Este accesorio, de fabricación experta y fácil de montar en el asa del asiento trasero, combina funcionalidad y elegancia. Su diseño estratégico no solo asegura tu bolsa de golf durante la ronda, sino que también ofrece un cómodo acceso a la botella de arena.'),
((SELECT id FROM series WHERE nombre='D2'), 'Kits de asientos traseros abatibles', 1, 500*36.66,'Maximice la versatilidad de su carrito de golf con nuestros kits de asientos traseros Flip Flop. Diseñados para una transición fluida entre asientos adicionales y mayor espacio de carga, este elegante accesorio es revolucionario. No solo amplía la funcionalidad de su carrito, sino que también le da un toque de elegancia con su diseño estilizado.');

INSERT INTO roles (nombre) VALUES
('admin'),
('gerente_general');
INSERT INTO permisos (nombre) VALUES
('gestionar_usuarios'),
('gestionar_roles'),
('gestionar_permisos'),
('ver_clientes'),
('ver_productos'),
('crear_productos'),
('editar_productos'),
('eliminar_productos'),
('gestionar_cotizaciones'),
('editar_cotizaciones');

-- Admin: todos los permisos
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r
JOIN permisos p
WHERE r.nombre = 'admin';

INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r
JOIN permisos p
WHERE r.nombre = 'gerente_general'
  AND p.nombre IN (
    'ver_clientes','ver_productos','crear_productos','editar_productos','eliminar_productos',
    'gestionar_cotizaciones','editar_cotizaciones'
  );
  SET @key = 'aeskeyimhorsadev';
INSERT INTO usuarios (username, password_user, nombre, correo, rol_id)
VALUES (
    'admonos',
    AES_ENCRYPT('imhorsanicdev', @key),
    'Dylan',
    'dgodoyvallecillo919@gmail.com',
    1
);

select*from usuarios;
SELECT 
    id, username, nombre, correo
FROM usuarios
WHERE username = 'admonos'
  AND CAST(AES_DECRYPT(password_user, @key) AS CHAR) = 'imhorsanicdev';

