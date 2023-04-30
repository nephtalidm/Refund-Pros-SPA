using System;
using System.Collections.Generic;

namespace RefundProsSPA.Data.DbContexts;

public partial class User
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();

    public virtual ICollection<Todo> Todos { get; set; } = new List<Todo>();
}
