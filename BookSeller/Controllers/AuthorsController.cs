using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookSeller.Models;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
using BookSeller.Utils;
namespace BookSeller.Controllers
{
    
    
    public class AuthorQueryModel
    {
        [StringRange(AllowableValues = new[] { "default", "deleted" })]
        public string Filter { get; set; } = "default";
        public UInt32 Page { get; set; } = 1;
        public UInt32 Limit { get; set; } = 10;
        public string? Search { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class AuthorsController : ControllerBase
    {
        private readonly booksellerContext _context;

        public AuthorsController(booksellerContext context)
        {
            _context = context;
        }

        // GET: api/Authors
        [HttpGet]
        public async Task<IActionResult> GetAuthors([FromQuery] AuthorQueryModel query)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            int start = Convert.ToInt32((query.Page - 1) * query.Limit);
            int limit = Convert.ToInt32(query.Limit);
            string? search = String.IsNullOrEmpty(query.Search)? null : query.Search.Trim().ToLower();
            var author = _context.Authors
                            .Where(author => String.IsNullOrEmpty(search) ?
                                                       true :
                                                       author.Name.ToLower().Contains(search) || author.Description.ToLower().Contains(search))
                            .Where(author => query.Filter == "default"? (author.Deleted == false) : (author.Deleted == true));
            var count = author.Count();
            var limited_author = await author.OrderByDescending(author => author.Id).Skip(start)
                                .Take(limit).ToListAsync();
            return new JsonResult(new
            {
                rowCount = count,
                currentPage = Convert.ToInt32(query.Page),
                rowsPerPage = limit,
                rows = limited_author
            });
        }
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Author>>> GetAuthors()
        //{
        //    return await _context.Authors.ToListAsync();
        //}

        // GET: api/Authors/5

        [HttpGet("{id}")]
        public async Task<ActionResult<Author>> GetAuthor(int id)
        {
            var author = await _context.Authors.FindAsync(id);

            if (author == null)
            {
                return NotFound();
            }

            return author;
        }
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Author>> PostAuthor(Author author)
        {
            _context.Authors.Add(author);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAuthor", new { id = author.Id }, author);
        }

        // PUT: api/Authors/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAuthor(int id, Author author)
        {
            if (id != author.Id)
            {
                return BadRequest();
            }

            //_context.Entry(author).State = EntityState.Modified;

            // https://stackoverflow.com/questions/39712453/ignore-null-values-in-context-update
            //  only if if the value is not null, the field will change.
            _context.Authors.Attach(author);
            _context.Entry(author).Property(a => a.Name).IsModified = author.Name != null;
            _context.Entry(author).Property(a => a.Description).IsModified = author.Description != null;
            _context.Entry(author).Property(a => a.Deleted).IsModified = author.Deleted != null;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AuthorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(await _context.Authors.FindAsync(id));
        }

        // POST: api/Authors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        

        // DELETE: api/Authors/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            var author = await _context.Authors.FindAsync(id);
            if (author == null)
            {
                return NotFound();
            }

            _context.Authors.Remove(author);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AuthorExists(int id)
        {
            return _context.Authors.Any(e => e.Id == id);
        }
    }
}
