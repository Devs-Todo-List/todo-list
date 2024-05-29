﻿using server.Data;
using Microsoft.EntityFrameworkCore;

namespace server.Repositories;

public class TaskRepository(AppDbContext context) : GenericRepository<Models.Task>(context)
{
    public override async Task<Models.Task?> GetById(int id)
    {
        var task = await base.GetById(id);
        if (task != null)
        {
            await context.Entry(task).Collection(t => t.Comments).LoadAsync();
            await context.Entry(task).Reference(t => t.User).LoadAsync();
        }

        return task;
    }
}
