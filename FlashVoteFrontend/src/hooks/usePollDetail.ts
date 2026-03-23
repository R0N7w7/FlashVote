import { useQuery } from '@tanstack/react-query'
import { pollKeys } from '@/lib/query-keys'
import { getPollById } from '@/services/poll-api'

export function usePollDetail(pollId: string | null) {
  return useQuery({
    queryKey: pollId ? pollKeys.detail(pollId) : pollKeys.detail('none'),
    queryFn: () => getPollById(pollId!),
    enabled: Boolean(pollId),
  })
}