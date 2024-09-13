import ftp from 'basic-ftp';

export const connectClient = async () => {
  console.log('connectClient');

  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: 'localhost',
      port: 50021,
      user: 'admin',
      password: '123456',
      secure: false
    });

    await client.uploadFrom('package.json', 'packagewssss.json');
  } catch (err) {
    console.log(err);
  }
}