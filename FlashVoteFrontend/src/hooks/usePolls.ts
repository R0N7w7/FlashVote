import { useQuery } from '@tanstack/react-query'
import { pollKeys } from '@/lib/query-keys'
import { getPolls } from '@/services/poll-api'

export function usePolls() {
  return useQuery({
    queryKey: pollKeys.all,
    queryFn: getPolls,
  })
}