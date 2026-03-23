export const pollKeys = {
  all: ['polls'] as const,
  detailAll: ['poll-detail'] as const,
  detail: (pollId: string) => ['poll-detail', pollId] as const,
}