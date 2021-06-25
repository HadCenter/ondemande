import pika
import time
import jsonpickle
from enum import Enum
from talendEsb.views import startEngineWithLinkAndData


class PikaMassenger():

    exchange_name = 'job.to.start'
    listenToJobStart = True

    def __init__(self, *args, **kwargs):
        credentials = pika.PlainCredentials('ucuvenkg', 'g8SXY-tERqixsWjG1PL6N-BP98jsU5fH')
        #self.conn = pika.BlockingConnection(pika.ConnectionParameters(host='rat.rmq2.cloudamqp.com/ucuvenkg', port=5672, credentials=credentials))
        self.conn = pika.BlockingConnection(pika.URLParameters('amqps://ucuvenkg:g8SXY-tERqixsWjG1PL6N-BP98jsU5fH@rat.rmq2.cloudamqp.com/ucuvenkg') )

        #self.conn = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
        self.channel = self.conn.channel()
        self.channel.exchange_declare(
            exchange=self.exchange_name,
            exchange_type='topic',durable=True)

    def consumeStartJob(self, keys, callback):
        result = self.channel.queue_declare('converge.queue.job.start', durable=True)
        queue_name = result.method.queue
        for key in keys:
            self.channel.queue_bind(
                exchange=self.exchange_name,
                queue=queue_name,
                routing_key=key)

        self.channel.basic_consume(
            queue=queue_name,
            on_message_callback=callback,
            auto_ack=True)

        self.channel.start_consuming()


    def consumeEndJob(self, keys, callback):
        result = self.channel.queue_declare('converge.queue.job.ended', durable=True)
        queue_name = result.method.queue


        self.channel.basic_consume(
            queue=queue_name,
            on_message_callback=callback,
            auto_ack=True)

        self.channel.start_consuming()


    def __enter__(self):
        return self


    def __exit__(self, exc_type, exc_value, traceback):
        self.conn.close()

def start_consumer():

    def startTheTalendJob(rabbitMqMessageSent : str):
        objectSentOnRabbitMQ = jsonpickle.decode(rabbitMqMessageSent)

        startEngineWithLinkAndData(objectSentOnRabbitMQ['webhook'],objectSentOnRabbitMQ['payloadToSendToTalend'])

    def callbackForStartingJob(ch, method, properties, body):
        print(" [x] %r:%r consumed" % (method.routing_key, body))
        startTheTalendJob(body.decode("utf-8"))
        ch.basic_cancel(ch.consumer_tags[0])

    def callbackForEndedJob(ch, method, properties, body):
        print(" [x] %r:%r consumed" % (method.routing_key, body))
        ch.basic_cancel(ch.consumer_tags[0])


    consumer =  PikaMassenger()

    while True :
        print("CONSUMER BOOLEAN STATE : " + str(consumer.listenToJobStart) )
        if consumer.listenToJobStart == True :
            print("listen to job to start channel")
            consumer.consumeStartJob(keys=[''], callback=callbackForStartingJob)
            consumer.listenToJobStart = False
        else:
            print("listen to job ended channel")
            consumer.consumeEndJob(keys=[''], callback=callbackForEndedJob)
            time.sleep(3)
            consumer.listenToJobStart = True