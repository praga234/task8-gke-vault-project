INSERT INTO alerts
(alert_name, severity, source_ip, destination_ip, status, assigned_to)
VALUES
(
'Brute Force Attack',
'Critical',
'10.10.10.10',
'172.16.1.10',
'Open',
'Pragnesh'
);

INSERT INTO alerts
(alert_name, severity, source_ip, destination_ip, status, assigned_to)
VALUES
(
'Malware Detection',
'High',
'10.10.20.20',
'172.16.1.20',
'In Progress',
'Analyst1'
);