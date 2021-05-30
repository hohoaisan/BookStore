using System;
using System.Collections.Generic;

#nullable disable

namespace BookSeller.Models
{
    public partial class Ward
    {
        public Ward()
        {
            Orders = new HashSet<Order>();
            Users = new HashSet<User>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int District { get; set; }

        public virtual District DistrictNavigation { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<User> Users { get; set; }
    }
}
