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
    public class OrderQueryModel
    {
        [StringRange(AllowableValues = new[] { "default", "pending", "accepted", "error","rejected", "completed" })]
        public string Filter { get; set; } = "default";
        public UInt32 Page { get; set; } = 1;
        public UInt32 Limit { get; set; } = 10;
        public string? Search { get; set; }
    }
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly booksellerContext _context;

        public OrdersController(booksellerContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetOrders([FromQuery] OrderQueryModel query)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int start = Convert.ToInt32((query.Page - 1) * query.Limit);
            int limit = Convert.ToInt32(query.Limit);
            string? search = String.IsNullOrEmpty(query.Search) ? null : query.Search.Trim().ToLower();
            var q = from order in _context.Orders
                    where String.IsNullOrEmpty(search) ?
                                                       true :
                                                       order.Id.ToString() == search
                    where query.Filter == "pending" ? (order.Status == "p") :
                          query.Filter == "accepted" ? (order.Status == "a") :
                          query.Filter == "rejected" ? (order.Status == "r") :
                          query.Filter == "error" ? (order.Status == "e") :
                          query.Filter == "completed"? (order.Status == "c") : true
                    join user in _context.Users on order.User equals user.Id
                    join shipping in _context.Shippings on order.Shipping equals shipping.Id
                    join payment in _context.Payments on order.Shipping equals payment.Id
                    orderby order.Timestamp descending
                    select new
                    {
                        Id = order.Id,
                        User = user.Fullname,
                        Status = order.Status,
                        Timestamp = order.Timestamp,
                        Address = order.Address,
                        Total = order.Total,
                        Receiver = order.ReceiverName,
                        Phone = order.Phone,
                        Shipping = shipping.Name,
                        Payment = payment.Name,
                        TotalItems = (from item in _context.Orderdetails where item.Order == order.Id select item.Qty).Sum()
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

        // GET: api/Orders/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }
            var user = await _context.Users.FindAsync(order.User);
            var shipping = await _context.Shippings.FindAsync(order.Shipping);
            var payment = await _context.Payments.FindAsync(order.Payment);

            var items = from item in _context.Orderdetails
                        where item.Order == order.Id
                        join book in _context.Books on item.Book equals book.Id
                        select new
                        {
                            Id = book.Id,
                            Name = book.Name,
                            Quantity = item.Qty,
                            Price = item.Amount / item.Qty,
                            Total = item.Amount
                        }
                        ;
            return new JsonResult(new
            {
                Id = order.Id,
                User = user.Fullname,
                Status = order.Status,
                Timestamp = order.Timestamp,
                Address = order.Address,
                Total = order.Total,
                Receiver = order.ReceiverName,
                Phone = order.Phone,
                Shipping = shipping.Name,
                Payment = payment.Name,
                TotalItems = (from item in _context.Orderdetails where item.Order == order.Id select item.Qty).Sum(),
                Items = items
            });
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, Order order)
        {
            if (id != order.Id)
            {
                return BadRequest();
            }

            _context.Orders.Attach(order);
            _context.Entry(order).Property(a => a.Status).IsModified = order.Status != null;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
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

        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<Order>> PostOrder(Order order)
        //{
        //    _context.Orders.Add(order);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetOrder", new { id = order.Id }, order);
        //}

        // DELETE: api/Orders/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteOrder(int id)
        //{
        //    var order = await _context.Orders.FindAsync(id);
        //    if (order == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Orders.Remove(order);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
