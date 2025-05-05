import dns from 'dns'

export function isConnectedToInternet() {
  return new Promise((resolve) => {
    dns.lookup('google.com', (err) => {
      if (err && err.code === 'ENOTFOUND') {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}
