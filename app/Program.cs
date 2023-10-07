var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var app = builder.Build();

app.UseHttpLogging();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

RegisterEndpoints(app);

app.MapFallbackToFile("index.html");

app.Run();

static void RegisterEndpoints(WebApplication app)
{
    WeatherEndpoint.Map(app);
}