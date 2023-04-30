using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RefundProsSPA.Business.Models;
using RefundProsSPA.Data.DbContexts;

namespace RefundProsSPA.Business
{
	public class CRUD
	{
		private readonly RefundProsContext _context;

		public CRUD(RefundProsContext context)
		{
			_context = context;
		}

		public async Task RepopulateDb()
		{
			//Clean out dB
			_context.Todos.RemoveRange(_context.Todos);
			_context.Posts.RemoveRange(_context.Posts);
			_context.Users.RemoveRange(_context.Users);
			_context.SaveChanges();

			//Get data from JSONPlaceholder
			HttpClient client = new HttpClient();

			//GET users and populate dB
			HttpResponseMessage response = await client.GetAsync("https://jsonplaceholder.typicode.com/users");
			string json = await response.Content.ReadAsStringAsync();
			var userList = JsonConvert.DeserializeObject<List<User>>(json);
			if (userList != null)
			{
				await _context.Users.AddRangeAsync(userList);
				await _context.SaveChangesAsync();
			}

			//GET todos and populate dB
			response = await client.GetAsync("https://jsonplaceholder.typicode.com/todos");
			json = await response.Content.ReadAsStringAsync();
			var todoList = JsonConvert.DeserializeObject<List<Todo>>(json);
			if (todoList != null)
			{
				foreach (Todo todo in todoList)
					todo.Id = 0;

				await _context.Todos.AddRangeAsync(todoList);
				await _context.SaveChangesAsync();
			}

			//GET posts and populate dB
			response = await client.GetAsync("https://jsonplaceholder.typicode.com/posts");
			json = await response.Content.ReadAsStringAsync();
			var postList = JsonConvert.DeserializeObject<List<Post>>(json);
			if (postList != null)
			{
				foreach (Post post in postList)
					post.Id = 0;

				await _context.Posts.AddRangeAsync(postList);
				await _context.SaveChangesAsync();
			}
		}

		public async Task<int> CreateTodo(TodoListModel newTodo)
		{
			var todo = new Todo
			{
				UserId = newTodo.UserId,
				Title = newTodo.Title
			};
			await _context.Todos.AddAsync(todo);
			await _context.SaveChangesAsync();
			return todo.Id;
		}

        public async Task<int> CreatePost(PostListModel newPost)
        {
            var post = new Post
            {
                UserId = newPost.UserId,
                Title = newPost.Title,
				Body = newPost.Body
            };
            await _context.Posts.AddAsync(post);
            await _context.SaveChangesAsync();
			return post.Id;
        }

        public async Task<List<User>> GetUsers()
		{
			var users = await _context.Users.Include(x => x.Posts).Include(x => x.Todos).ToListAsync();
			foreach (var user in users)
			{
				user.Todos = user.Todos.OrderBy(x => x.Id).ToList();
                user.Posts = user.Posts.OrderBy(x => x.Id).ToList();
            }
			return users;
		}

		public void DeleteUser(int id)
		{
			var user = _context.Users.Where(x => x.Id == id).FirstOrDefault();
			if (user != null)
			{
				var todos = _context.Todos.Where(x => x.UserId == id).ToList();
				_context.Todos.RemoveRange(todos);
				var posts = _context.Posts.Where(x => x.UserId == id).ToList();
				_context.Posts.RemoveRange(posts);
				_context.Users.Remove(user);
				_context.SaveChanges();
			}
		}

		public void DeleteTodo(int id)
		{
			var todo = _context.Todos.Where(x => x.Id == id).FirstOrDefault();
			if (todo != null)
			{
				_context.Todos.Remove(todo);
				_context.SaveChanges();
			}
		}

		public void UpdateUser(UserListModel userModel)
		{
			var user = _context.Users.Where(x => x.Id == userModel.Id).FirstOrDefault();
			if (user != null)
			{
				user.Name = userModel.Name;
				user.Username = userModel.Username;
				user.Email = userModel.Email;
				_context.SaveChanges();
			}
		}

		public async Task<List<PictureListModel>> GetRandomPictures(int count = 7)
		{
			HttpClient client = new HttpClient();
			var response = client.GetAsync("https://jsonplaceholder.typicode.com/photos").Result;
			string responseBody = await response.Content.ReadAsStringAsync();
			var pictures = JsonConvert.DeserializeObject<List<PictureListModel>>(responseBody);
			var selected = new List<PictureListModel>();

			if (pictures != null)
			{
				Random rnd = new Random();
				for (int i = 0; i < count; i++)
				{
					selected.Add(pictures[rnd.Next(pictures.Count - 1)]);

				}
			}
			return selected;
		}
	}
}