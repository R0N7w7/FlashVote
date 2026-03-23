export interface PollOption {
  id: string
  text: string
  voteCount: number
  pollId: string
}

export interface PollListItem {
  id: string
  title: string
  description: string
  createdAt: string
  expiresAt: string | null
  isClosed: boolean
}

export interface PollDetail extends PollListItem {
  options: PollOption[]
}

export interface VoteParams {
  pollId: string
  optionId: string
}