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

        public async Task<List<ResponsePollDto>> GetAllAsync()
        {
            var polls = await _repository.GetAllAsync();
            return polls.Select(pol => new ResponsePollDto(
                pol.Id,
                pol.Title,
                pol.Description,
                pol.ExpiresAt
            )).ToList();
        }

        public async Task<Poll?> GetByIdAsync(Guid id) => await _repository.GetByIdAsync(id);
        public async Task<Poll> CreateAsync(CreatePollDto newPoll)
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
            return await _repository.CreateAsync(poll);
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

        public async Task<bool> DeletePollAsync(Guid pollId) => await _repository.DeletePollAsync(pollId);
    }
}
