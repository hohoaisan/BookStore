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

namespace BookSeller.Controllers
{
    public class CategoryQueryModel
    {
        [StringRange(AllowableValues = new[] { "default", "deleted" })]
        public string Filter { get; set; } = "default";
        public UInt32 Page { get; set; } = 1;
        public UInt32 Limit { get; set; } = 10;
        public string? Search { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly booksellerContext _context;

        public CategoriesController(booksellerContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<IActionResult> GetCategories([FromQuery] CategoryQueryModel query)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int start = Convert.ToInt32((query.Page - 1) * query.Limit);
            int limit = Convert.ToInt32(query.Limit);
            string? search = String.IsNullOrEmpty(query.Search) ? null : query.Search.Trim().ToLower();
            var q = _context.Categories
                            .Where(q => String.IsNullOrEmpty(search) ?
                                                       true :
                                                       q.Name.ToLower().Contains(search))
                            .Where(q => query.Filter == "default" ? (q.Deleted == false) : (q.Deleted == true));
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

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // PUT: api/Categories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, Category category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }

            //_context.Entry(category).State = EntityState.Modified;
            _context.Categories.Attach(category);
            _context.Entry(category).Property(a => a.Name).IsModified = category.Name != null;
            _context.Entry(category).Property(a => a.Deleted).IsModified = category.Deleted != null;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(await _context.Categories.FindAsync(id));
        }

        // POST: api/Categories
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategory", new { id = category.Id }, category);
        }

        // DELETE: api/Categories/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
