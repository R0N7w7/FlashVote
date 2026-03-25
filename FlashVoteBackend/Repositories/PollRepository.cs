using FlashVoteBackend.Data;
using FlashVoteBackend.Models;
using FlashVoteBackend.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace FlashVoteBackend.Repositories
{
    public class PollRepository
    {
        private readonly ApplicationDbContext _context;

        public PollRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Poll>> GetAllAsync()
        {
            return await _context.Polls
                .ToListAsync();
        }

        public async Task<Poll?> GetByIdAsync(Guid id)
        {
            return await _context.Polls
                .Include(p => p.Options)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Poll> CreateAsync(Poll poll)
        {
            _context.Polls.Add(poll);
            await _context.SaveChangesAsync();
            return poll;
        }

        public async Task<bool> VoteAsync(Guid optionId)
        {
            var result = await _context.Options
                .Where(o => o.Id == optionId)
                .ExecuteUpdateAsync(setters =>
                    setters.SetProperty(o => o.VoteCount, o => o.VoteCount + 1)
                );
            return result > 0;
        }

        public async Task<bool> DeletePollAsync(Guid pollId) { 
            var poll = await _context.Polls.FindAsync(pollId);
            if (poll == null) return false;
            _context.Polls.Remove(poll);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
