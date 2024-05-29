using server.Data;
using server.Models;

namespace server.Repositories
{
    public class StatusRepository(AppDbContext context) : GenericRepository<Status>(context);
}
 
