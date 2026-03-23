using Microsoft.AspNetCore.SignalR;

namespace FlashVoteBackend.Hubs
{
    public class PollHub : Hub
    {
        public async Task JoinPoll(string pollId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, pollId);
        }

        public async Task LeavePoll(string pollId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, pollId);
        }
    }
}
