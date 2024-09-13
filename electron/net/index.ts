import net from 'node:net';

const subnet = '192.168.50';
const port = 50021;
const timeout = 100;

function scanPort(ip, port) {
  return new Promise((resolve) => {  
    const socket = new net.Socket();  

    socket.setTimeout(timeout);  
    console.log(`Scanning ${ip}:${port}`);
    socket.on('connect', () => {  
      console.log(`Port ${port} is open on ${ip}`);  
      socket.destroy();  
      resolve(true);  
    });  

    socket.on('timeout', () => {  
      socket.destroy();  
      resolve(false);  
    });  

    socket.on('error', () => {  
      resolve(false);  
    });  

    socket.connect(port, ip);  
  });
}

export async function scanNetwork() {
  for (let i = 1; i <= 254; i++) {  
    const ip = `${subnet}.${i}`;  
    await scanPort(ip, port);  
  }
}