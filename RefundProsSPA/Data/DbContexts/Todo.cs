using System;
using System.Collections.Generic;

namespace RefundProsSPA.Data.DbContexts;

public partial class Todo
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Title { get; set; } = null!;

    public bool Completed { get; set; }

    public virtual User User { get; set; } = null!;
}
