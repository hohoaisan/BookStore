using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#nullable disable

namespace BookSeller.Models
{
    public partial class Book
    {
        public Book()
        {
            Orderdetails = new HashSet<Orderdetail>();
        }

        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public int? Pages { get; set; }
        [Required]
        public float? Weight { get; set; }
        public DateTime? PublishDay { get; set; }
        public int ViewCount { get; set; }
        public int PurchaseCount { get; set; }
        [Required]
        public int? Author { get; set; }
        [Required]
        public int? Category { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public decimal Price { get; set; }
        public DateTime? Timestamp { get; set; }
        public string Publisher { get; set; }
        public string Cover { get; set; }
        public bool? Deleted { get; set; }

        public virtual Author AuthorNavigation { get; set; }
        public virtual Category CategoryNavigation { get; set; }
        public virtual ICollection<Orderdetail> Orderdetails { get; set; }
    }
}

//using System;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;

//#nullable disable

//namespace BookSeller.Models
//{
//    public partial class Book
//    {
//        public Book()
//        {
//            Orderdetails = new HashSet<Orderdetail>();
//        }

//        public int Id { get; set; }
//        [Required]
//        public string Name { get; set; }
//        public string ImageUrl { get; set; }
//        [Required]
//        public string Description { get; set; }
//        [Required]
//        public int? Pages { get; set; }
//        [Required]
//        public float? Weight { get; set; }
//        public DateTime? PublishDay { get; set; }
//        public int? ViewCount { get; set; }
//        public int? PurchaseCount { get; set; }
//        [Required]
//        public int? Author { get; set; }
//        [Required]
//        public int? Category { get; set; }
//        [Required]
//        public int? Quantity { get; set; }
//        [Required]
//        public decimal? Price { get; set; }
//        public DateTime? Timestamp { get; set; }
//        public string Publisher { get; set; }
//        public string Cover { get; set; }
//        public bool? Deleted { get; set; }

//        public virtual Author AuthorNavigation { get; set; }
//        public virtual Category CategoryNavigation { get; set; }
//        public virtual ICollection<Orderdetail> Orderdetails { get; set; }
//    }
//}
