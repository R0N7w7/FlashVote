import { Button } from '@/components/ui/button'
import type { PollOption } from '@/types/poll'

interface PollOptionsProps {
  options: PollOption[]
  onVote: (optionId: string) => void
  isVoting: boolean
  disabled: boolean
}

export function PollOptions({ options, onVote, isVoting, disabled }: PollOptionsProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Votar</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <Button
            key={option.id}
            variant="outline"
            disabled={isVoting || disabled}
            className="justify-between rounded-xl"
            onClick={() => onVote(option.id)}
          >
            <span className="truncate">{option.text}</span>
            <span className="text-xs opacity-70">{option.voteCount} votos</span>
          </Button>
        ))}
      </div>
      {disabled ? <p className="text-sm text-muted-foreground">Esta encuesta está cerrada.</p> : null}
    </div>
  )
}