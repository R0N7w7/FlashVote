import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr'
import { getApiBaseUrl } from '@/services/http'

type VoteListener = (optionId: string) => void
type StateListener = (state: HubConnectionState) => void

class PollRealtimeClient {
  private connection: HubConnection | null = null
  private voteListeners = new Set<VoteListener>()
  private stateListeners = new Set<StateListener>()

  getConnectionState() {
    return this.connection?.state ?? HubConnectionState.Disconnected
  }

  addVoteListener(listener: VoteListener) {
    this.voteListeners.add(listener)
    return () => this.voteListeners.delete(listener)
  }

  addStateListener(listener: StateListener) {
    this.stateListeners.add(listener)
    return () => this.stateListeners.delete(listener)
  }

  async connect() {
    if (!this.connection) {
      this.connection = new HubConnectionBuilder()
        .withUrl(`${getApiBaseUrl()}/pollhub`, {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build()

      this.connection.on('ReceiveVote', (optionId: string) => {
        this.voteListeners.forEach((listener) => listener(optionId))
      })

      this.connection.onclose(() => this.emitState())
      this.connection.onreconnecting(() => this.emitState())
      this.connection.onreconnected(() => this.emitState())
    }

    if (this.connection.state === HubConnectionState.Disconnected) {
      await this.connection.start()
      this.emitState()
    }

    return this.connection
  }

  async joinPoll(pollId: string) {
    const connection = await this.connect()
    await connection.invoke('JoinPoll', pollId)
  }

  async leavePoll(pollId: string) {
    if (!this.connection || this.connection.state !== HubConnectionState.Connected) {
      return
    }

    await this.connection.invoke('LeavePoll', pollId)
  }

  private emitState() {
    const state = this.getConnectionState()
    this.stateListeners.forEach((listener) => listener(state))
  }
}

export const pollRealtimeClient = new PollRealtimeClient()