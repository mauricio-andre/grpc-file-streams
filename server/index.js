const fs = require('fs/promises')
const grpc = require('@grpc/grpc-js')
const path = require('path')
const protoLoader = require('@grpc/proto-loader')
const { Upload, Download, Transform, ListFiles } = require('./handlers')
const protoPath = path.resolve(__dirname, '../proto')

async function main () {
  await fs.mkdir(path.resolve(__dirname, './uploads'), { recursive: true })

  const packageDefinition = await protoLoader.load(
    path.join(protoPath,
      'file.proto'));

  const FileDefinition = grpc.loadPackageDefinition(packageDefinition);

  const server = new grpc.Server();
  server.addService(FileDefinition.FileService.service, {
    Upload,
    Download,
    Transform,
    ListFiles
  });

  server.bindAsync(
    '0.0.0.0:50051',
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.timeLog('Service iniciado');
  });
}

main()
  .then(console.log)
  .catch(console.error)
