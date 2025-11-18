// tests/e2e/setup.ts
import { TransformStream } from 'node:stream/web';

if (!global.TransformStream) {
  global.TransformStream = TransformStream;
}
