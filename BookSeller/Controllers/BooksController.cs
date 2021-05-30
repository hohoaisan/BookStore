using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookSeller.Models;
using BookSeller.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace BookSeller.Controllers
{
    public class BookQueryModel
    {
        [StringRange(AllowableValues = new[] { "default", "deleted" })]
        public string Filter { get; set; } = "default";
        public UInt32 Page { get; set; } = 1;
        public UInt32 Limit { get; set; } = 10;
        public string? Search { get; set; }
    }
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly booksellerContext _context;

        public BooksController(booksellerContext context)
        {
            _context = context;
        }

        // GET: api/Books
        [HttpGet]
        public async Task<IActionResult> GetBooks([FromQuery] BookQueryModel query)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int start = Convert.ToInt32((query.Page - 1) * query.Limit);
            int limit = Convert.ToInt32(query.Limit);
            string? search = String.IsNullOrEmpty(query.Search) ? null : query.Search.Trim().ToLower();
            var q = from book in _context.Books
                    where String.IsNullOrEmpty(search) ?
                                                       true :
                                                       book.Name.ToLower().Contains(search) || book.Description.ToLower().Contains(search)
                    where query.Filter == "default" ? (book.Deleted == false) : (book.Deleted == true)
                    join author in _context.Authors on book.Author equals author.Id
                    join category in _context.Categories on book.Category equals category.Id
                    select new
                    {
                        Id = book.Id,
                        Name = book.Name,
                        Image = book.ImageUrl,
                        Author = author.Name,
                        Category = category.Name,
                        PurchaseCount = book.PurchaseCount,
                        ViewCount = book.ViewCount,
                        Quantity = book.Quantity,
                        Price = book.Price,
                        Deleted = book.Deleted
                    };
            var count = q.Count();
            var limited_q = await q.OrderByDescending(q => q.Id).Skip(start)
                                .Take(limit).ToListAsync();
            return new JsonResult(new
            {
                rowCount = count,
                currentPage = Convert.ToInt32(query.Page),
                rowsPerPage = limit,
                rows = limited_q
            });
        }

        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        //{
        //    return await _context.Books.ToListAsync();
        //}
        // GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        // PUT: api/Books/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id, Book book)
        {
            ModelState.Clear();
            if (id != book.Id)
            {
                return BadRequest();
            }
            //var target = _context.Books.Find(id);
            //if (target == null)
            //{
            //    return NotFound();
            //}
            //_context.Entry(target).State = EntityState.Detached;


            //target = InjectNonNull.inject<Book>(target, book);

            //_context.Entry(target).State = EntityState.Modified;

            _context.Books.Attach(book);
            _context.Entry(book).Property(a => a.Name).IsModified = book.Name != null;
            _context.Entry(book).Property(a => a.ImageUrl).IsModified = book.ImageUrl != null;
            _context.Entry(book).Property(a => a.Description).IsModified = book.Description != null;
            _context.Entry(book).Property(a => a.Pages).IsModified = book.Pages != null;
            _context.Entry(book).Property(a => a.Weight).IsModified = book.Weight != null;
            _context.Entry(book).Property(a => a.PublishDay).IsModified = book.PublishDay != null;
            _context.Entry(book).Property(a => a.ViewCount).IsModified = book.ViewCount != null && book.ViewCount != 0;
            _context.Entry(book).Property(a => a.PurchaseCount).IsModified = book.PurchaseCount != null && book.PurchaseCount != 0;
            _context.Entry(book).Property(a => a.Author).IsModified = book.Author != null  && book.Author != 0;
            _context.Entry(book).Property(a => a.Category).IsModified = book.Category != null && book.Category != 0;
            _context.Entry(book).Property(a => a.Quantity).IsModified = book.Quantity != null && book.Quantity != 0;
            _context.Entry(book).Property(a => a.Price).IsModified = book.Price != null && book.Price != 0;
            _context.Entry(book).Property(a => a.Publisher).IsModified = book.Publisher != null;
            _context.Entry(book).Property(a => a.Cover).IsModified = book.Cover != null;
            _context.Entry(book).Property(a => a.Deleted).IsModified = book.Deleted != null;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(book);
        }

        // POST: api/Books
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Book>> PostBook(Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBook", new { id = book.Id }, book);
        }

        // DELETE: api/Books/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookExists(int id)
        {
            return _context.Books.Any(e => e.Id == id);
        }
    }
}
