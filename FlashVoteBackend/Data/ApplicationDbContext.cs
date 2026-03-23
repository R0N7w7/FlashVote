using FlashVoteBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace FlashVoteBackend.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<Poll> Polls => Set<Poll>();
        public DbSet<Option> Options => Set<Option>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Poll>()
                .HasMany(p => p.Options)
                .WithOne()
                .HasForeignKey(o => o.PollId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
