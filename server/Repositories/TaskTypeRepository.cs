using server.Data;
using server.Models;

namespace server.Repositories
{
    public class TaskTypeRepository(AppDbContext context) : GenericRepository<TaskType>(context);
}
