import dns from 'dns'

//  NOTE:
// fungsi untuk pengecekan perangkat sedang terhubung ke internet atau tidak.
export function isConnectedToInternet() {
  return new Promise((resolve) => {
    dns.lookup('google.com', (err) => {
      if (err && err.code === 'ENOTFOUND') {
        //  NOTE:
        //  jika domain tidak bisa diresolve, maka dianggap koneksi tidak tersedia.
        resolve(false)
      } else {
        //  NOTE:
        //  jika berhasil diresolve, maka koneksi internet tersedia.
        resolve(true)
      }
    })
  })
}
