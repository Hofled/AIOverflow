-- The hashed password is 'verysecurepassword'
INSERT INTO "Users" ("Id", "Name", "PasswordHash")
VALUES (-1, 'administrator', 'AQAAAAIAAYagAAAAEHdDTPR69sevaAKq6hrQ831BXctHcaqjVZFHZIFA3nZt7RjCzTmAzAZiRhZmZwYxog==');
INSERT INTO "UserClaim" ("Id", "Type", "Value", "UserId")
VALUES (-1, 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role', 'admin', -1);
INSERT INTO "UserClaim" ("Id", "Type", "Value", "UserId")
VALUES (-2, 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier', 'administrator', -1);
INSERT INTO "UserClaim" ("Id", "Type", "Value", "UserId")
VALUES (-3, 'ID', '-1', -1);