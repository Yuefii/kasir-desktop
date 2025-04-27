import { useEffect, useState } from 'react'
import axios from 'axios'

interface SyncStatus {
  status: 'sinkron' | 'tidak sinkron'
  tables: Record<string, number>
}

export default function SyncPanel() {
  const [status, setStatus] = useState<SyncStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [syncResult, setSyncResult] = useState<Record<string, number> | null>(null)

  const fetchStatus = async () => {
    const res = await axios.get('http://localhost:3001/api/sync/status')
    setStatus(res.data)
  }

  const syncNow = async () => {
    setLoading(true)
    setSyncResult(null)
    try {
      const res = await axios.post('http://localhost:3001/api/sync/manual')
      setSyncResult(res.data.result)
      await fetchStatus()
    } catch (err) {
      console.error('Sync error:', err)
      alert('Gagal sinkronisasi manual dikarenakan kamu sedang di mode offline!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  return (
    <div className="max-w-xl  mt-5 p-6 bg-white border border-black rounded-md">
      <h2 className="text-2xl font-bold mb-4">Status Sinkronisasi</h2>

      {status ? (
        <div className="mb-4">
          <p
            className={`text-sm font-medium ${status.status === 'sinkron' ? 'text-green-600' : 'text-red-600'}`}
          >
            Status: {status.status.toUpperCase()}
          </p>
          {status.status === 'tidak sinkron' && status.tables && (
            <ul className="list-disc list-inside mt-2">
              {Object.entries(status.tables).map(([table, count]) => (
                <li key={table}>
                  <span className="font-semibold">{table}</span>: {count} belum sinkron
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p>Memuat status...</p>
      )}

      {status?.status === 'tidak sinkron' && (
        <button
          onClick={syncNow}
          className="bg-black text-sm text-white px-4 py-2 rounded hover:bg-opacity-80"
          disabled={loading}
        >
          {loading ? 'Menyinkronkan...' : 'Sinkronisasi Sekarang'}
        </button>
      )}

      {syncResult && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Hasil Sinkronisasi:</h3>
          <ul className="list-disc list-inside">
            {Object.entries(syncResult).map(([table, count]) => (
              <li key={table}>
                <span className="font-semibold">{table}</span>: {count} data disinkron
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
