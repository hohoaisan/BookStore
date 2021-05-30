using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace BookSeller.Models
{
    public partial class booksellerContext : DbContext
    {
        public booksellerContext()
        {
        }

        public booksellerContext(DbContextOptions<booksellerContext> options)
            : base(options)
        {
        }
        public virtual DbSet<Author> Authors { get; set; }
        public virtual DbSet<Book> Books { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<District> Districts { get; set; }
        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<Orderdetail> Orderdetails { get; set; }
        public virtual DbSet<Payment> Payments { get; set; }
        public virtual DbSet<Province> Provinces { get; set; }
        public virtual DbSet<Shipping> Shippings { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Ward> Wards { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;initial catalog=bookseller;user id=sa;password=PASSWORD_HERE;MultipleActiveResultSets=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<Author>(entity =>
            {
                entity.ToTable("author");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Deleted)
                    .HasColumnName("deleted")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasColumnName("description");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("name");
            });

            modelBuilder.Entity<Book>(entity =>
            {
                entity.ToTable("book");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Author).HasColumnName("author");

                entity.Property(e => e.Category).HasColumnName("category");

                entity.Property(e => e.Cover)
                    .HasMaxLength(50)
                    .HasColumnName("cover");

                entity.Property(e => e.Deleted)
                    .HasColumnName("deleted")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasColumnName("description");

                entity.Property(e => e.ImageUrl)
                    .HasMaxLength(200)
                    .HasColumnName("image_url");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(45)
                    .HasColumnName("name");

                entity.Property(e => e.Pages).HasColumnName("pages");

                entity.Property(e => e.Price)
                    .HasColumnType("decimal(10, 0)")
                    .HasColumnName("price");

                entity.Property(e => e.PublishDay)
                    .HasColumnType("date")
                    .HasColumnName("publish_day");

                entity.Property(e => e.Publisher)
                    .HasMaxLength(50)
                    .HasColumnName("publisher");

                entity.Property(e => e.PurchaseCount).HasColumnName("purchase_count");

                entity.Property(e => e.Quantity).HasColumnName("quantity");

                entity.Property(e => e.Timestamp)
                    .HasPrecision(0)
                    .HasColumnName("timestamp")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.ViewCount).HasColumnName("view_count");

                entity.Property(e => e.Weight).HasColumnName("weight");

                entity.HasOne(d => d.AuthorNavigation)
                    .WithMany(p => p.Books)
                    .HasForeignKey(d => d.Author)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__book__author__2BFE89A6");

                entity.HasOne(d => d.CategoryNavigation)
                    .WithMany(p => p.Books)
                    .HasForeignKey(d => d.Category)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__book__category__2CF2ADDF");
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("category");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Deleted)
                    .HasColumnName("deleted")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("name");
            });

            modelBuilder.Entity<District>(entity =>
            {
                entity.ToTable("district");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(30)
                    .HasColumnName("name");

                entity.Property(e => e.Province).HasColumnName("province");

                entity.HasOne(d => d.ProvinceNavigation)
                    .WithMany(p => p.Districts)
                    .HasForeignKey(d => d.Province)
                    .HasConstraintName("FK__district__provin__3E1D39E1");
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.ToTable("order");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Address)
                    .IsRequired()
                    .HasColumnName("address");

                entity.Property(e => e.Payment).HasColumnName("payment");

                entity.Property(e => e.Phone)
                    .IsRequired()
                    .HasMaxLength(12)
                    .HasColumnName("phone");

                entity.Property(e => e.ReceiverName)
                    .HasMaxLength(255)
                    .HasColumnName("receiver_name");

                entity.Property(e => e.Shipping).HasColumnName("shipping");

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasMaxLength(1)
                    .HasColumnName("status")
                    .IsFixedLength(true);

                entity.Property(e => e.Timestamp)
                    .HasPrecision(0)
                    .HasColumnName("timestamp");

                entity.Property(e => e.Total).HasColumnName("total");

                entity.Property(e => e.User).HasColumnName("user");

                entity.Property(e => e.Ward).HasColumnName("ward");

                entity.HasOne(d => d.PaymentNavigation)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.Payment)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__order__payment__11158940");

                entity.HasOne(d => d.ShippingNavigation)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.Shipping)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__order__shipping__10216507");

                entity.HasOne(d => d.UserNavigation)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.User)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__order__user__0E391C95");

                entity.HasOne(d => d.WardNavigation)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.Ward)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__order__ward__0F2D40CE");
            });

            modelBuilder.Entity<Orderdetail>(entity =>
            {
                entity.HasKey(e => new { e.Order, e.Book })
                    .HasName("pk");

                entity.ToTable("orderdetail");

                entity.Property(e => e.Order).HasColumnName("order");

                entity.Property(e => e.Book).HasColumnName("book");

                entity.Property(e => e.Amount).HasColumnName("amount");

                entity.Property(e => e.Qty).HasColumnName("qty");

                entity.HasOne(d => d.BookNavigation)
                    .WithMany(p => p.Orderdetails)
                    .HasForeignKey(d => d.Book)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__orderdetai__book__1C873BEC");

                entity.HasOne(d => d.OrderNavigation)
                    .WithMany(p => p.Orderdetails)
                    .HasForeignKey(d => d.Order)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__orderdeta__order__1B9317B3");
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.ToTable("payment");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Default)
                    .HasColumnName("default")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.Info).HasColumnName("info");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("name");
            });

            modelBuilder.Entity<Province>(entity =>
            {
                entity.ToTable("province");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(30)
                    .HasColumnName("name");
            });

            modelBuilder.Entity<Shipping>(entity =>
            {
                entity.ToTable("shipping");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Default)
                    .HasColumnName("default")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("name");

                entity.Property(e => e.Pricing)
                    .HasColumnType("decimal(10, 0)")
                    .HasColumnName("pricing");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("user");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Address).HasColumnName("address");

                entity.Property(e => e.Admin).HasColumnName("admin");

                entity.Property(e => e.Disable).HasColumnName("disable");

                entity.Property(e => e.Dob)
                    .HasColumnType("date")
                    .HasColumnName("dob");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(45)
                    .HasColumnName("email");

                entity.Property(e => e.Fullname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("fullname");

                entity.Property(e => e.Gender).HasColumnName("gender");

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("password");

                entity.Property(e => e.Phone)
                    .IsRequired()
                    .HasMaxLength(11)
                    .HasColumnName("phone");

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(30)
                    .HasColumnName("username");

                entity.Property(e => e.Ward).HasColumnName("ward");

                entity.HasOne(d => d.WardNavigation)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.Ward)
                    .HasConstraintName("FK__user__ward__6BE40491");
            });

            modelBuilder.Entity<Ward>(entity =>
            {
                entity.ToTable("ward");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.District).HasColumnName("district");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(30)
                    .HasColumnName("name");

                entity.HasOne(d => d.DistrictNavigation)
                    .WithMany(p => p.Wards)
                    .HasForeignKey(d => d.District)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__ward__district__625A9A57");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
