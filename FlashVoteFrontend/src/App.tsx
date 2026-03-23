import { useMemo, useState } from 'react'
import { Activity } from 'lucide-react'
import { PollChart } from '@/components/polls/PollChart'
import { PollList } from '@/components/polls/PollList'
import { PollOptions } from '@/components/polls/PollOptions'
import { PollRealtimeStatus } from '@/components/polls/PollRealtimeStatus'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePollDetail } from '@/hooks/usePollDetail'
import { usePollRealtime } from '@/hooks/usePollRealtime'
import { usePolls } from '@/hooks/usePolls'
import { useVoteMutation } from '@/hooks/useVoteMutation'

function App() {
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null)

  const pollsQuery = usePolls()
  const effectiveSelectedPollId = selectedPollId ?? pollsQuery.data?.[0]?.id ?? null
  const pollDetailQuery = usePollDetail(effectiveSelectedPollId)
  const voteMutation = useVoteMutation()
  const realtime = usePollRealtime(effectiveSelectedPollId)

  const selectedPoll = pollDetailQuery.data
  const totalVotes = useMemo(
    () => selectedPoll?.options.reduce((sum, option) => sum + option.voteCount, 0) ?? 0,
    [selectedPoll],
  )

  const handleVote = (optionId: string) => {
    if (!effectiveSelectedPollId) {
      return
    }

    voteMutation.mutate({ pollId: effectiveSelectedPollId, optionId })
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 md:px-6 md:py-10">
      <header className="mb-6 rounded-3xl border bg-card/90 p-5 shadow-sm backdrop-blur md:mb-8 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">FlashVote Live Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              Visualiza y actualiza encuestas en tiempo real usando SignalR.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1 text-xs">
              <Activity className="h-3.5 w-3.5" />
              {pollsQuery.data?.length ?? 0} encuestas
            </Badge>
            <PollRealtimeStatus state={realtime.connectionState} />
          </div>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <Card className="border bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle>Encuestas activas</CardTitle>
            <CardDescription>Selecciona una encuesta para ver resultados y votar.</CardDescription>
          </CardHeader>
          <CardContent>
            <PollList
              polls={pollsQuery.data ?? []}
              selectedPollId={effectiveSelectedPollId}
              isLoading={pollsQuery.isLoading}
              isError={pollsQuery.isError}
              onSelect={setSelectedPollId}
            />
          </CardContent>
        </Card>

        <Card className="border bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle>{selectedPoll?.title ?? 'Selecciona una encuesta'}</CardTitle>
            <CardDescription>
              {selectedPoll?.description ?? 'Cuando selecciones una encuesta verás aquí el detalle.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {pollDetailQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Cargando resultados...</p>
            ) : pollDetailQuery.isError ? (
              <p className="text-sm text-destructive">No se pudo cargar el detalle de la encuesta.</p>
            ) : selectedPoll ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Card className="rounded-2xl border bg-secondary/30">
                    <CardContent className="p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Total de votos</p>
                      <p className="mt-1 text-2xl font-semibold">{totalVotes}</p>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl border bg-secondary/30">
                    <CardContent className="p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Estado</p>
                      <p className="mt-1 text-2xl font-semibold">{selectedPoll.isClosed ? 'Cerrada' : 'Abierta'}</p>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl border bg-secondary/30 sm:col-span-2 lg:col-span-1">
                    <CardContent className="p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Expira</p>
                      <p className="mt-1 text-base font-semibold">
                        {selectedPoll.expiresAt ? new Date(selectedPoll.expiresAt).toLocaleString() : 'Sin fecha'}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <PollChart options={selectedPoll.options} />
                <PollOptions
                  options={selectedPoll.options}
                  onVote={handleVote}
                  isVoting={voteMutation.isPending}
                  disabled={selectedPoll.isClosed}
                />
                {voteMutation.isError ? (
                  <p className="text-sm text-destructive">No se pudo registrar el voto. Intenta de nuevo.</p>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No hay una encuesta seleccionada.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

export default App
