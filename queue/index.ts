import { config } from 'dotenv';
import EmailConsumer from './emailConsumer';

config();

const consumer = new EmailConsumer();

consumer.start(() => {
  // eslint-disable-next-line no-console
  console.log(`📨[email-consumer] Listening for Messages from RabbitMQ`);
});
