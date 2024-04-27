create-sql-migrations:
	dotnet ef migrations script --idempotent -o ./database/init.sql

create-code-migrations:
	dotnet ef database update
	dotnet ef migrations add