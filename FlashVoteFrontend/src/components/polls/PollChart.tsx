import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PollOption } from '@/types/poll'

interface PollChartProps {
  options: PollOption[]
}

const COLORS = ['#f97316', '#10b981', '#0ea5e9', '#f59e0b', '#ef4444', '#6366f1']

export function PollChart({ options }: PollChartProps) {
  if (!options.length) {
    return <p className="text-sm text-muted-foreground">Esta encuesta no tiene opciones disponibles.</p>
  }

  return (
    <div className="h-[320px] w-full rounded-2xl border bg-card p-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={options} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d8c7b5" />
          <XAxis dataKey="text" tick={{ fontSize: 12 }} interval={0} angle={-12} textAnchor="end" height={52} />
          <YAxis allowDecimals={false} />
          <Tooltip
            formatter={(value) => {
              const numericValue = typeof value === 'number' ? value : Number(value ?? 0)
              return [numericValue, 'Votos']
            }}
          />
          <Bar dataKey="voteCount" radius={[10, 10, 0, 0]}>
            {options.map((option, index) => (
              <Cell key={option.id} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}