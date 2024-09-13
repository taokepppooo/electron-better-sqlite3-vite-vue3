import ftpSrv from 'ftp-srv';

const port=50021;

export const createServer = async () => {
  const server = new ftpSrv({
    url: `ftp://192.168.50.227:${port}`,
    anonymous: true,
  });

  server.on('login', ({ connection, username, password }, resolve, reject) => {
    if (username === 'admin' && password === '123456') {
      resolve({ root: './' });
    } else {
      reject(new Error('Unauthorized'));
    }
  });

  server.listen().then(() => {
    console.log(`Server running at ftp://`)
  }).catch((err) => {
    console.log(err);
  });
}