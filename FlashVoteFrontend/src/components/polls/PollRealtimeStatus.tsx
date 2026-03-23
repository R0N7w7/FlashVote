import { HubConnectionState } from '@microsoft/signalr'
import { Badge } from '@/components/ui/badge'

interface PollRealtimeStatusProps {
  state: HubConnectionState
}

function resolveLabel(state: HubConnectionState) {
  switch (state) {
    case HubConnectionState.Connected:
      return { label: 'SignalR conectado', variant: 'default' as const }
    case HubConnectionState.Reconnecting:
      return { label: 'Reconectando...', variant: 'secondary' as const }
    case HubConnectionState.Connecting:
      return { label: 'Conectando...', variant: 'secondary' as const }
    default:
      return { label: 'Desconectado', variant: 'outline' as const }
  }
}

export function PollRealtimeStatus({ state }: PollRealtimeStatusProps) {
  const status = resolveLabel(state)
  return (
    <Badge variant={status.variant} className="rounded-full px-3 py-1 text-xs">
      {status.label}
    </Badge>
  )
}