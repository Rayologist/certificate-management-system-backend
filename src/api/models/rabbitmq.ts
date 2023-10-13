import { connect as _connect, Connection } from 'amqplib';

const { RABBITMQ_URL } = process.env;

async function connect() {
  if (!RABBITMQ_URL) {
    throw new Error('Cannot find RABBITMQ_URL');
  }
  return _connect(RABBITMQ_URL);
}

class ConnectionManager {
  private connection: Connection | null = null;

  async connect() {
    if (this.connection) return this.connection;

    this.connection = await connect();
    return this.connection;
  }

  async getChannel() {
    const conn = await this.connect();
    const channel = await conn.createChannel();
    return channel;
  }
}

const connectionManager = new ConnectionManager();

export default connectionManager;
