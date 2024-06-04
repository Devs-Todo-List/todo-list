using System.Text;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using server;
using server.Data;
using server.Models;
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

builder.Services.AddCors(o => o.AddPolicy("MyPolicy", corsPolicyBuilder =>
{
    corsPolicyBuilder.WithOrigins("*")
        .AllowAnyMethod()
        .AllowAnyHeader();
}));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opts =>
    {
        var userPoolId = Environment.GetEnvironmentVariable("USERPOOL_ID")!;
        opts.Authority = $"https://cognito-idp.eu-west-1.amazonaws.com/{userPoolId}";
        opts.MetadataAddress =
            $"https://cognito-idp.eu-west-1.amazonaws.com/{userPoolId}/.well-known/openid-configuration";
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

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("admin", policy => policy.RequireClaim("cognito:groups", "admin"))
    .AddPolicy("user", policy => policy.RequireClaim("cognito:groups", "user"));

//Rate Limiting
builder.Services.Configure<MyRateLimitOptions>(
    builder.Configuration.GetSection(MyRateLimitOptions.MyRateLimit));

var myOptions = new MyRateLimitOptions();
builder.Configuration.GetSection(MyRateLimitOptions.MyRateLimit).Bind(myOptions);
const string fixedPolicy = "fixed";

builder.Services.AddRateLimiter(rlo => rlo
    .AddFixedWindowLimiter(policyName: fixedPolicy, options =>
    {
        options.PermitLimit = myOptions.PermitLimit;
        options.Window = TimeSpan.FromSeconds(myOptions.Window);
        options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        options.QueueLimit = myOptions.QueueLimit;
    }));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("MyPolicy");

app.UseExceptionHandler("/error");
app.MapControllers().RequireAuthorization().RequireRateLimiting(fixedPolicy);

app.Run();