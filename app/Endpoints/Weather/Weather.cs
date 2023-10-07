public static class WeatherEndpoint {
    public static void Map(WebApplication app) {
        var _group = app.MapGroup("/weather");
        _group.MapGet("/", () => "Weather Endpoint");
        _group.MapGet("/{city}", (string city) => $"The weather for {city} is sunny");
    }
}