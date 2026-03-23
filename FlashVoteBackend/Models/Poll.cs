namespace FlashVoteBackend.Models
{
    public record Poll
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public bool IsClosed { get; set; }
        public List<Option> Options { get; set; } = new();
    }
}
