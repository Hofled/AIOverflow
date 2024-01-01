using AIOverflow.Database;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.AddConsole();
AIOverflow.Identity.Services.ConfigureServices(builder);
AddDbContext(builder);

var app = builder.Build();
app.MapFallbackToFile("index.html");

AIOverflow.Identity.Endpoints.ConfigureIdentity(app);
UseAppMiddlewares(app);

app.Logger.LogInformation("Starting web server");
app.Run();

static void AddDbContext(WebApplicationBuilder builder)
{
    string? DbConnectionString = Environment.GetEnvironmentVariable("ConnectionString");

    if (DbConnectionString == null)
    {
        throw new Exception("ConnectionString is null");
    }

    builder.Services.AddDbContext<PostgresDb>(options => options.UseNpgsql(DbConnectionString));
}

static void UseAppMiddlewares(WebApplication app)
{
    // Configure the HTTP request pipeline.
    if (!app.Environment.IsDevelopment())
    {
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }

    app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.UseHttpLogging();
    app.UseAuthentication();
    app.UseAuthorization();
}