﻿namespace server.Models;

public partial class User
{
    public int UserId { get; set; }
    public string Email { get; set; }
    public string? Username { get; set; } = null;

    public string? UserPicUrl { get; set; } = null;
    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
}