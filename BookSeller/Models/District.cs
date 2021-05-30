using System;
using System.Collections.Generic;

#nullable disable

namespace BookSeller.Models
{
    public partial class District
    {
        public District()
        {
            Wards = new HashSet<Ward>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int? Province { get; set; }

        public virtual Province ProvinceNavigation { get; set; }
        public virtual ICollection<Ward> Wards { get; set; }
    }
}
