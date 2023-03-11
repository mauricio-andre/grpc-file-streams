const path = require('path');
const fs = require('fs');

module.exports = (client, filePath) => {
  const serverStream = client.Transform();
  if (!fs.existsSync(filePath)) {
    console.error('Arquivo não encontrado');
    return process.exit(1);
  }

  if (fs.statSync(filePath).isDirectory()) {
    console.error('Não é possível transforma um pasta, selecione um arquivos');
    process.exit(1);
  }

  const fileReadStream = fs.createReadStream(filePath);
  fileReadStream.on('data', (payload) => {
    serverStream.write({ data: Uint8Array.from(payload) });
  });

  serverStream.on('data', ({ data }) => {
    process.stdout.write(data.toString());
  });

  fileReadStream.on('end', () => {
    serverStream.end();
  });
}
