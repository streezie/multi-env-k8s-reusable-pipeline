using Confluent.Kafka;
using Prometheus;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Enable Prometheus metrics endpoint routing automatically at /metrics
app.UseHttpMetrics();

app.MapGet("/api/status", async (IConfiguration config) => {
    var kafkaBootstrap = config["Kafka:BootstrapServers"];
    
    // Fire a message tracking event directly to Kafka Topic
    var kafkaConfig = new ProducerConfig { BootstrapServers = kafkaBootstrap };
    using var producer = new ProducerBuilder<Null, string>(kafkaConfig).Build();
    await producer.ProduceAsync("events-topic", new Message<Null, string> { Value = "API Event Triggered at " + DateTime.UtcNow });

    return Results.Ok(new { status = "Healthy", framework = ".NET 8 Core", message = "Dispatched event payload cleanly to Kafka broker" });
});

app.MapMetrics(); // Exposes endpoints cleanly to Prometheus metrics scraper

app.Run("http://0.0.0");
