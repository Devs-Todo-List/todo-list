using server.Data;
using server.Models;

namespace server.Repositories
{
    public class RoleRepository(AppDbContext context) : GenericRepository<Role>(context)
    {
        public async Task<Role?> FindByRoleType(string role)
        {
            return await base.FindSingle(r => r.RoleType == role);
        }
    }
}
