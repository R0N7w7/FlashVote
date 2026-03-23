import { HubConnectionState } from '@microsoft/signalr'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { pollKeys } from '@/lib/query-keys'
import { pollRealtimeClient } from '@/services/signalr'

export function usePollRealtime(activePollId: string | null) {
  const queryClient = useQueryClient()
  const previousPollIdRef = useRef<string | null>(null)
  const activePollIdRef = useRef<string | null>(activePollId)
  const [connectionState, setConnectionState] = useState<HubConnectionState>(
    pollRealtimeClient.getConnectionState(),
  )

  useEffect(() => {
    activePollIdRef.current = activePollId
  }, [activePollId])

  useEffect(() => {
    const unsubscribeState = pollRealtimeClient.addStateListener((state) => {
      setConnectionState(state)
    })

    const unsubscribeVote = pollRealtimeClient.addVoteListener(() => {
      const currentPollId = activePollIdRef.current
      if (!currentPollId) {
        return
      }

      void queryClient.invalidateQueries({ queryKey: pollKeys.detail(currentPollId) })
      void queryClient.invalidateQueries({ queryKey: pollKeys.all })
    })

    return () => {
      unsubscribeState()
      unsubscribeVote()
    }
  }, [queryClient])

  useEffect(() => {
    const syncGroups = async () => {
      if (!activePollId) {
        if (previousPollIdRef.current) {
          await pollRealtimeClient.leavePoll(previousPollIdRef.current)
          previousPollIdRef.current = null
        }
        return
      }

      if (previousPollIdRef.current && previousPollIdRef.current !== activePollId) {
        await pollRealtimeClient.leavePoll(previousPollIdRef.current)
      }

      await pollRealtimeClient.joinPoll(activePollId)
      previousPollIdRef.current = activePollId
    }

    void syncGroups()
  }, [activePollId])

  return {
    connectionState,
  }
}