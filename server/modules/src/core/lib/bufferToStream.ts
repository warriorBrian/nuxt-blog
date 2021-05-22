import {Duplex} from 'stream';
export function bufferToStream(buffer) {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export default bufferToStream
