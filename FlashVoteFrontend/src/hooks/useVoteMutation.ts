import { useMutation, useQueryClient } from '@tanstack/react-query'
import { pollKeys } from '@/lib/query-keys'
import { voteOnPoll } from '@/services/poll-api'
import type { VoteParams } from '@/types/poll'

export function useVoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: VoteParams) => voteOnPoll(payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: pollKeys.detail(variables.pollId) })
      void queryClient.invalidateQueries({ queryKey: pollKeys.all })
    },
  })
}