namespace FlashVoteBackend.Models
{
    public record Option
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public int VoteCount { get; set; }
        public Guid PollId { get; set; }
    }
}
