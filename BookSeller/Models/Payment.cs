using System;
using System.Collections.Generic;

#nullable disable

namespace BookSeller.Models
{
    public partial class Payment
    {
        public Payment()
        {
            Orders = new HashSet<Order>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Info { get; set; }
        public bool? Default { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}
