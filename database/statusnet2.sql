USE statusnet;

INSERT INTO devices (name, ip_address, type)
VALUES
('Servidor Principal', '192.168.1.10', 'Servidor'),
('Roteador Central', '192.168.1.1', 'Roteador'),
('Switch Escritório', '192.168.1.2', 'Switch'),
('PC Administrativo', '192.168.1.20', 'Computador'),
('Notebook Visitante', '192.168.1.30', 'Notebook');

INSERT INTO tests (device_id, status, latency)
VALUES
(1, 'online', 12.4),
(1, 'offline', NULL),
(2, 'online', 4.8),
(3, 'online', 1.0),
(4, 'offline', NULL),
(5, 'online', 20.5);

SHOW TABLES;
SELECT * FROM devices;
SELECT * FROM tests;