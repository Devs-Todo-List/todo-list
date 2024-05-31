namespace server.Data
{
    public class DbConnectionDetails(string connectionString)
    {
        public string ConnectionString { get; } = connectionString;
    }
}
