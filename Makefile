create-sql-migrations:
	dotnet ef migrations script --idempotent -o ./database/init.sql