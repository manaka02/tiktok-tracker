import { useMemo } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  buildCurrentMonthDailyStats,
  getCurrentMonthLabel,
} from '../../utils/stats'

export default function StatsModal({ entries, onClose }) {
  const data = useMemo(() => buildCurrentMonthDailyStats(entries), [entries])
  const monthLabel = getCurrentMonthLabel()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-input bg-surface p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="stats-title" className="text-lg font-semibold">
              Statistiques
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              {monthLabel} — évolution par jour
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-input hover:text-text"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {data.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">
            Aucun lien enregistré ce mois-ci
          </p>
        ) : (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#888', fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#888', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: '#f0f0f0' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                  formatter={(value) =>
                    value === 'videos'
                      ? 'Vidéos'
                      : value === 'comments'
                        ? 'Commentaires'
                        : 'Total'
                  }
                />
                <Line
                  type="monotone"
                  dataKey="comments"
                  name="comments"
                  stroke="#00c8ff"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#00c8ff' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="videos"
                  name="videos"
                  stroke="#ff2d55"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#ff2d55' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
