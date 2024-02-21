-- The hashed password is 'verysecurepassword'
INSERT INTO "Users" ("Id", "Name", "PasswordHash")
VALUES (-1, 'administrator', 'AQAAAAIAAYagAAAAEHdDTPR69sevaAKq6hrQ831BXctHcaqjVZFHZIFA3nZt7RjCzTmAzAZiRhZmZwYxog==');
INSERT INTO "UserClaim" ("Id", "Type", "Value", "UserId")
VALUES (-1, 'role', 'admin', -1);
INSERT INTO "UserClaim" ("Id", "Type", "Value", "UserId")
VALUES (-2, 'username', 'administrator', -1);