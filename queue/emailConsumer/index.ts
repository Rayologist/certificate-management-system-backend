import { connect } from '@models';
import { MQAdminSendCertificatePayload, MQSendCertificatePayload } from 'types';
import handleConsume from './handleConsume';
import { handleAdminConsume } from './handleAdminConsume';

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
      try {
        if (!msg?.content) {
          return;
        }

        const message: { type: string } & Record<string, any> = JSON.parse(msg.content.toString());

        if (!message) {
          return;
        }

        await sleep(24);

        if (message.type === 'userSendCertificate') {
          await handleConsume(message as unknown as MQSendCertificatePayload);
        } else if (message.type === 'adminSendCertificate') {
          await handleAdminConsume(message as unknown as MQAdminSendCertificatePayload);
        }

        if (msg !== null) {
          channel.ack(msg);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
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
