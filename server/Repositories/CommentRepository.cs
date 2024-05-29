using System.Linq.Expressions;
using server.Data;
using server.Models;
using Microsoft.EntityFrameworkCore;

namespace server.Repositories;

public class CommentRepository(AppDbContext context) : GenericRepository<Comment>(context)
{
    public async override Task<Comment?> GetById(int id)
    {
        var comment = await base.GetById(id);
        if (comment != null)
        {
            await context.Entry(comment).Reference(c => c.Task).LoadAsync();
            await context.Entry(comment.Task).Reference(t => t.User).LoadAsync();
        }

        return comment;
    }

    public async override Task<ICollection<Comment>> FindAll(Expression<Func<Comment, bool>> predicate)
    {
        return await context.Comments.Where(predicate)
            .Include(c => c.Task)
            .ThenInclude(t => t.User)
            .ToListAsync();
    }
}
