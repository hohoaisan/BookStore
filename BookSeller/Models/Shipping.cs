using System;
using System.Collections.Generic;

#nullable disable

namespace BookSeller.Models
{
    public partial class Shipping
    {
        public Shipping()
        {
            Orders = new HashSet<Order>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Pricing { get; set; }
        public bool? Default { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}
