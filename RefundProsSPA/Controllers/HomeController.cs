using Microsoft.AspNetCore.Mvc;
using RefundProsSPA.Business;
using RefundProsSPA.Business.Models;
using RefundProsSPA.Data.DbContexts;
using System.Diagnostics;

namespace RefundProsSPA.Controllers
{
	public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly RefundProsContext _context;
        private readonly CRUD _crud;

        public HomeController(ILogger<HomeController> logger, RefundProsContext context, CRUD crud)
        {
            _logger = logger;
            _context = context;
            _crud = crud;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task RepopulateDb()
        {
			await _crud.RepopulateDb();
		}

		[HttpPost]
        public async Task<int> CreateTodo(TodoListModel todo)
        {
            return await _crud.CreateTodo(todo);
        }

        [HttpPost]
        public async Task<int> CreatePost(PostListModel post)
        {
            return await _crud.CreatePost(post);
        }

        [HttpGet]
        public async Task<List<User>> GetUsers()
        {
			return await _crud.GetUsers();
        }

        [HttpDelete]
        public void DeleteUser(int id)
        {
            _crud.DeleteUser(id);
        }

        [HttpDelete]
        public void DeleteTodo(int id)
        {
            _crud.DeleteTodo(id);
        }

        [HttpPut]
        public void UpdateUser(UserListModel userModel)
        {
            _crud.UpdateUser(userModel);
        }

        [HttpGet]
        public async Task<List<PictureListModel>> GetRandomPictures(int count = 7)
        {
            return await _crud.GetRandomPictures();
        }

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}