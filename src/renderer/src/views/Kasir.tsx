import { ReactElement, useEffect, useState } from 'react'
import axios from 'axios'

const Kasir = (): ReactElement => {
  const [mode, setMode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchMode = async () => {
    try {
      const response = await axios.get('http://localhost:3001/mode')
      setMode(response.data.mode)
      setIsLoading(false)
      setError(null)
    } catch (err) {
      console.error('Axios error:', err)
      setError('Gagal mengambil status mode!')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMode()

    const interval = setInterval(() => {
      fetchMode()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">MENU KASIR</h1>

      {isLoading && <p className="text-gray-500">Loading...</p>}

      {error && <p className="text-red-600">{error}</p>}

      {mode && (
        <div>
          <h2 className="text-lg">
            Status:{' '}
            <span
              className={`font-bold ${mode === 'online' ? 'text-green-600' : 'text-orange-500'}`}
            >
              {mode.toUpperCase()}
            </span>
          </h2>
        </div>
      )}
    </div>
  )
}

export default Kasir
