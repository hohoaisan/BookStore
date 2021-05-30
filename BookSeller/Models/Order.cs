using System;
using System.Collections.Generic;

#nullable disable

namespace BookSeller.Models
{
    public partial class Order
    {
        public Order()
        {
            Orderdetails = new HashSet<Orderdetail>();
        }

        public int Id { get; set; }
        public int User { get; set; }
        public string Status { get; set; }
        public DateTime Timestamp { get; set; }
        public int Ward { get; set; }
        public string Address { get; set; }
        public double Total { get; set; }
        public string ReceiverName { get; set; }
        public string Phone { get; set; }
        public int Shipping { get; set; }
        public int Payment { get; set; }

        public virtual Payment PaymentNavigation { get; set; }
        public virtual Shipping ShippingNavigation { get; set; }
        public virtual User UserNavigation { get; set; }
        public virtual Ward WardNavigation { get; set; }
        public virtual ICollection<Orderdetail> Orderdetails { get; set; }
    }
}
