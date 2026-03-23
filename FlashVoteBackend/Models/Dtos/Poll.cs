namespace FlashVoteBackend.Models.Dtos
{
    public record CreatePollDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime? ExpiresAt { get; set; }
        public List<string> Options { get; set; } = new();
    }

    public record UpdatePollDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime? ExpiresAt { get; set; }
        public bool IsClosed { get; set; }
        public List<string> Options { get; set; } = new();
    }
}
