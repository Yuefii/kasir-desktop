import { ReactElement, useEffect, useState } from 'react'
import axios from 'axios'

const Kasir = (): ReactElement => {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/data')
      .then((response) => {
        // response.data udah otomatis berupa object
        setData(response.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Axios error:', err)
        setError('Something went wrong! Please try again.')
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="p-10">
      <h1>MENU KASIR</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div>
          <h2>Data from server:</h2>
          <p>
            <strong>Pesan:</strong> {data.message}
          </p>
          <p>
            <strong>Waktu:</strong> {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  )
}

export default Kasir
