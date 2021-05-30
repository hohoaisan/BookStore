using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

#nullable disable

namespace BookSeller.Models
{
    public partial class User
    {
        public User()
        {
            Orders = new HashSet<Order>();
        }

        public int Id { get; set; }
        public string Password { get; set; }
        public string Username { get; set; }
        public bool Admin { get; set; }
        public bool Disable { get; set; }
        public string Fullname { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public bool Gender { get; set; }
        public int? Ward { get; set; }
        public string Address { get; set; }
        public DateTime? Dob { get; set; }

        public virtual Ward WardNavigation { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
    }
}
