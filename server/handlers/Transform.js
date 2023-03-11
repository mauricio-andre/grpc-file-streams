module.exports = (request) => {
  request.on('data', ({ data }) => {
    const text = data.toString();
    request.write({
      data: Uint8Array.from(Buffer.from(text.toUpperCase()))
    });
  });

  request.on('end', () => request.end());
}
