using Microsoft.EntityFrameworkCore;
using RefundProsSPA.Business;
using RefundProsSPA.Data.DbContexts;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews()

//Dealing with circular reference on EF Core
.AddNewtonsoftJson(options =>
options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

// Add Entity framework Microsoft SQL context
builder.Services.AddEntityFrameworkSqlServer().
    AddDbContext<RefundProsContext>(o => o.UseSqlServer(builder.Configuration["SQLConnectionStrings:DefaultConnection"],
    b => b.MigrationsAssembly("WernerCorp.Web")), ServiceLifetime.Singleton);

//Add business object
builder.Services.AddTransient<CRUD, CRUD>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

//Populate dB from https://jsonplaceholder.typicode.com/
//RefundProsSPA.Helpers.DBPopulator.PopulateDB();

app.Run();