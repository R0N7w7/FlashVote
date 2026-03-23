import { request } from '@/services/http'
import type { PollDetail, PollListItem, VoteParams } from '@/types/poll'

export async function getPolls(): Promise<PollListItem[]> {
  return request<PollListItem[]>('/api/poll')
}

export async function getPollById(pollId: string): Promise<PollDetail> {
  return request<PollDetail>(`/api/poll/${pollId}`)
}

export async function voteOnPoll({ pollId, optionId }: VoteParams): Promise<boolean> {
  return request<boolean>(`/api/poll/${pollId}/vote/${optionId}`, {
    method: 'POST',
  })
}