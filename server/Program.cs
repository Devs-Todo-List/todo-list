using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using server;
using server.Data;
using server.Repositories;

var builder = WebApplication.CreateBuilder(args);

var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new Exception("Connection string does not exist");
}

var dbConnectionDetails = new DbConnectionDetails(connectionString);

builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton(dbConnectionDetails);
builder.Services.AddDbContext<AppDbContext>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<StatusRepository>();
builder.Services.AddScoped<TaskTypeRepository>();
builder.Services.AddScoped<TaskRepository>();
builder.Services.AddScoped<CommentRepository>();


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opts =>
    {
        var clientId = Environment.GetEnvironmentVariable("USERPOOL_CLIENTID")!;
        opts.Authority = $"https://cognito-idp.eu-west-1.amazonaws.com/{clientId}";
        opts.MetadataAddress = $"https://cognito-idp.eu-west-1.amazonaws.com/{clientId}/.well-known/openid-configuration";
        opts.IncludeErrorDetails = true;
        opts.RequireHttpsMetadata = false;
        opts.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            RoleClaimType = "cognito:groups"
        };
    });

// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer();

builder.Services.AddAuthorization(options => {
    options.AddPolicy("admin", policy => policy.RequireClaim("cognito:groups", "admin"));
    options.AddPolicy("user", policy => policy.RequireClaim("cognito:groups", "user"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.MapGet("/test", () => {
    Console.WriteLine("Authentication working");
});

app.UseAuthentication();
app.UseAuthorization();

app.UseExceptionHandler("/error");
app.MapControllers().RequireAuthorization();

app.Run();