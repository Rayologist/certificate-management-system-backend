import { connect as _connect } from 'amqplib';

const { RABBITMQ_URL } = process.env;

async function connect() {
  if (!RABBITMQ_URL) {
    throw new Error('Cannot find RABBITMQ_URL');
  }
  return _connect(RABBITMQ_URL);
}

export default connect;
