import { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '@renderer/utils/env'

interface SyncStatus {
  status: 'sinkron' | 'tidak sinkron'
  table: Record<string, number>
}

export default function SyncPanel() {
  const [mode, setMode] = useState<string | null>(null)
  const [status, setStatus] = useState<SyncStatus | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchStatus = async () => {
    const res = await axios.get(`${BASE_URL}/sync/status`)
    setStatus(res.data)
  }

  const fetchMode = async () => {
    try {
      const response = await axios.get('http://localhost:3001/mode')
      setMode(response.data.mode)
    } catch (err) {
      console.error('Axios error:', err)
    }
  }

  const syncNow = async () => {
    setLoading(true)
    try {
      await axios.post(`${BASE_URL}/sync/manual`)
      alert('Sinkronisasi telah berhasil')
      await fetchStatus()
    } catch (err) {
      console.error('Sync error:', err)
      alert('Gagal sinkronisasi manual dikarenakan kamu sedang di mode offline!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMode()
    fetchStatus()

    const interval = setInterval(() => {
      fetchMode()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-[800px] mx-auto m-10 rounded  border border-gray-300">
      <div className="bg-black text-white px-4 py-2 rounded-t font-semibold text-lg">
        Panel Sinkronisasi Data
      </div>
      <div className="p-6 font-[system-ui] text-sm text-gray-800">
        {mode && (
          <p className={`font-bold ${mode === 'online' ? 'text-green-600' : 'text-red-600'}`}>
            <span className="text-black">Status Koneksi: </span> {mode.toUpperCase()}
          </p>
        )}
        {status ? (
          <div className="mb-4">
            <p
              className={`font-bold ${
                status.status === 'sinkron' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <span className="text-black">Status: </span> {status.status.toUpperCase()}
            </p>
            {status.table && (
              <div className="mt-2 border border-gray-300 bg-white rounded p-4">
                <h4 className="font-semibold mb-2">Tabel Yang Belum Sinkron:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(status.table).map(([table, count]) => (
                    <li key={table}>
                      <span className="font-medium">{table}</span>: {count} belum sinkron
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Memuat status...</p>
        )}

        {status?.status === 'tidak sinkron' && (
          <button
            onClick={syncNow}
            className={`mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Menyinkronkan...' : 'Sinkronisasi Sekarang'}
          </button>
        )}
      </div>
    </div>
  )
}
