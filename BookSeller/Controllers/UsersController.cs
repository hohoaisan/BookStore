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
    public class UserQueryModel
    {
        [StringRange(AllowableValues = new[] { "default", "disabled", "admin"})]
        public string Filter { get; set; } = "default";
        public UInt32 Page { get; set; } = 1;
        public UInt32 Limit { get; set; } = 10;
        public string? Search { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly booksellerContext _context;

        public UsersController(booksellerContext context)
        {
            _context = context;
        }
        // GET: api/Users

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] UserQueryModel query)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int start = Convert.ToInt32((query.Page - 1) * query.Limit);
            int limit = Convert.ToInt32(query.Limit);
            string? search = String.IsNullOrEmpty(query.Search) ? null : query.Search.Trim().ToLower();
            var q = from user in _context.Users
                    where String.IsNullOrEmpty(search) ?
                                                       true :
                                                       user.Fullname.ToLower().Contains(search) || user.Username.ToLower().Contains(search)
                                                    || user.Phone.ToLower().Contains(search) || user.Email.ToLower().Contains(search)
                    where query.Filter == "default" ? (user.Disable == false && user.Admin == false) :
                          query.Filter == "disabled" ? (user.Disable == true) :
                          query.Filter == "admin" ? (user.Admin == true) : true
                    select new
                    {
                        Disable = user.Disable,
                        Admin = user.Admin,
                        Id = user.Id,
                        Username = user.Username,
                        Fullname = user.Fullname,
                        Gender = user.Gender,
                        Phone  = user.Phone,
                        Email = user.Email,
                        Ward = user.Ward,
                        Addresss = user.Address
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
        //public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        //{
        //    return await _context.Users.ToListAsync();
        //}

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }
            // TODO: multiple address, temporary disabled
            //var ward = _context.Wards.Find(user.Ward);
            //var district = ward == null ? null : _context.Districts.Find(ward.District);
            //var province = ward == null ? null : _context.Provinces.Find(district.Province);
            //var FullAddress = user.Address + (ward == null ? "" : ", " + ward.Name + ", " + district.Name + ", " + province.Name);
            return new JsonResult(new
            {
                //Disable = user.Disable,
                //Admin = user.Admin,
                Id = user.Id,
                Username = user.Username,
                Fullname = user.Fullname,
                Gender = user.Gender,
                Dob = user.Dob,
                Phone = user.Phone,
                Email = user.Email,
                //Ward = user.Ward,
                Address = user.Address,
                //FullAddress = FullAddress
            });
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Users.Attach(user);
            //_context.Entry(user).Property(a => a.Password).IsModified = user.Password != null;
            _context.Entry(user).Property(a => a.Username).IsModified = user.Username != null;
            _context.Entry(user).Property(a => a.Admin).IsModified = user.Admin != null;
            _context.Entry(user).Property(a => a.Disable).IsModified = user.Disable != null;
            _context.Entry(user).Property(a => a.Fullname).IsModified = user.Fullname != null;
            _context.Entry(user).Property(a => a.Phone).IsModified = user.Phone != null;
            _context.Entry(user).Property(a => a.Email).IsModified = user.Email != null;
            _context.Entry(user).Property(a => a.Gender).IsModified = user.Gender != null;
            _context.Entry(user).Property(a => a.Ward).IsModified = user.Ward != null;
            _context.Entry(user).Property(a => a.Address).IsModified = user.Address != null;
            _context.Entry(user).Property(a => a.Dob).IsModified = user.Dob != null;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
