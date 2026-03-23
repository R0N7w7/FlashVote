using FlashVoteBackend.Hubs;
using FlashVoteBackend.Models;
using FlashVoteBackend.Models.Dtos;
using FlashVoteBackend.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace FlashVoteBackend.Services
{
    public class PollService
    {
        private readonly PollRepository _repository;
        private readonly IHubContext<PollHub> _hubContext;
        public PollService(PollRepository repository, IHubContext<PollHub> hubContext)
        {
            _repository = repository;
            _hubContext = hubContext;
        }

        public Task<List<Poll>> GetAllAsync() => _repository.GetAllAsync();
        public Task<Poll?> GetByIdAsync(Guid id) => _repository.GetByIdAsync(id);
        public Task<Poll> CreateAsync(CreatePollDto newPoll)
        {
            var poll = new Poll
            {
                Id = Guid.NewGuid(),
                Title = newPoll.Title,
                Description = newPoll.Description,
                ExpiresAt = newPoll.ExpiresAt,
                Options = newPoll.Options.Select(o => new Option { Text = o }).ToList(),
                CreatedAt = DateTime.UtcNow,
                IsClosed = false,
            };
            return _repository.CreateAsync(poll);
        }

        public async Task<bool> VoteAsync(Guid pollId, Guid optionId)
        {
            var success = await _repository.VoteAsync(optionId);

            if (success)
            {
                await _hubContext.Clients.Group(pollId.ToString())
                    .SendAsync("ReceiveVote", optionId);
            }

            return success;
        }

        public Task<bool> DeletePollAsync(Guid pollId) => _repository.DeletePollAsync(pollId);
    }
}
