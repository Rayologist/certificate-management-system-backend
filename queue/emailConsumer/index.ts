import { connect } from '@models';
import handleConsume from './handleConsume';

async function sleep(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

class EmailConsumer {
  queue: string;

  constructor() {
    this.queue = 'email';
  }

  async consume() {
    const conn = await connect();
    const channel = await conn.createChannel();
    await channel.assertQueue(this.queue);
    await channel.prefetch(1);
    await channel.consume(this.queue, async (msg) => {
      await sleep(24);
      await handleConsume(msg);
      if (msg !== null) {
        channel.ack(msg);
      }
    });
  }

  async start(fn?: Function) {
    await this.consume();

    if (fn instanceof Function) {
      fn();
    }
  }
}

export default EmailConsumer;
