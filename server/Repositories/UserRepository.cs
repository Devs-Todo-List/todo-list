using server.Data;
using server.Models;
using Microsoft.EntityFrameworkCore;

namespace server.Repositories
{
    public class UserRepository(AppDbContext context) : GenericRepository<User>(context)
    {
        public async Task<User?> FindByEmail(string email)
        {
            return await context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
