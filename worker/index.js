const { Kafka } = require('kafkajs');

const kafkaBroker = process.env.KAFKA_BROKER || 'kafka-service:9092';

const kafka = new Kafka({
  clientId: 'node-worker-app',
  brokers: [kafkaBroker]
});

const consumer = kafka.consumer({ groupId: 'worker-group' });

const runWorker = async () => {
  console.log("Worker starting up... Connecting to Kafka broker: " + kafkaBroker);
  await consumer.connect();
  await consumer.subscribe({ topic: 'events-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`[Worker Received]: ${message.value.toString()} from cluster partition ${partition}`);
    },
  });
};

runWorker().catch(err => {
  console.error("Worker processing failed critically: ", err);
  process.exit(1);
});
