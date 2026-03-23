import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PollListItem } from '@/types/poll'

interface PollListProps {
  polls: PollListItem[]
  selectedPollId: string | null
  isLoading: boolean
  isError: boolean
  onSelect: (pollId: string) => void
}

export function PollList({ polls, selectedPollId, isLoading, isError, onSelect }: PollListProps) {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando encuestas...</p>
  }

  if (isError) {
    return <p className="text-sm text-destructive">No se pudieron cargar las encuestas.</p>
  }

  if (!polls.length) {
    return <p className="text-sm text-muted-foreground">No hay encuestas disponibles.</p>
  }

  return (
    <div className="space-y-2">
      {polls.map((poll) => {
        const isActive = poll.id === selectedPollId
        return (
          <Button
            key={poll.id}
            variant={isActive ? 'default' : 'outline'}
            className={cn('h-auto w-full justify-between gap-4 rounded-xl p-4 text-left', isActive && 'shadow-sm')}
            onClick={() => onSelect(poll.id)}
          >
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold">{poll.title}</span>
              <span className="truncate text-xs opacity-80">{poll.description || 'Sin descripción'}</span>
            </div>
            <Badge variant={poll.isClosed ? 'outline' : 'secondary'}>{poll.isClosed ? 'Cerrada' : 'Activa'}</Badge>
          </Button>
        )
      })}
    </div>
  )
}