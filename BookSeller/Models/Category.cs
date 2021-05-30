﻿using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

#nullable disable

namespace BookSeller.Models
{
    public partial class Category
    {
        public Category()
        {
            Books = new HashSet<Book>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool? Deleted { get; set; }

        [JsonIgnore]
        public virtual ICollection<Book> Books { get; set; }
    }
}
