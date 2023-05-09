/* eslint-disable no-restricted-syntax */
import { Socket } from 'net';

import { Reader } from 'protobufjs/minimal';

export default async function* socketIterator(
  socket: Socket
): AsyncGenerator<Uint8Array> {
  let reader = Reader.create(Buffer.from([]));
  let length: number | undefined;

  for await (const chunk of socket) {
    reader = Reader.create(
      Buffer.concat([reader.buf.slice(reader.pos), chunk])
    );

    while (reader.pos < reader.len) {
      length = length || reader.uint32();
      if (length + reader.pos > reader.len) {
        break;
      } else {
        yield reader.buf.slice(reader.pos, reader.pos + length);
        reader.skip(length);
        length = undefined;
      }
    }
  }

  return undefined;
}
