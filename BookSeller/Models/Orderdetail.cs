using System;
using System.Collections.Generic;

#nullable disable

namespace BookSeller.Models
{
    public partial class Orderdetail
    {
        public int Qty { get; set; }
        public double Amount { get; set; }
        public int Order { get; set; }
        public int Book { get; set; }

        public virtual Book BookNavigation { get; set; }
        public virtual Order OrderNavigation { get; set; }
    }
}
