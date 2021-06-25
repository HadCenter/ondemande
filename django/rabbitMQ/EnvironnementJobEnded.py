import pika
import time
import jsonpickle
import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from websocket.consumers import ChatConsumer

class EnvironnementJobEnded():

    exchange_name = 'job.ended'
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

    def consumeQueue(self, keys, callback):
        result = self.channel.queue_declare('job.ended.dev', durable=True)
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




    def __enter__(self):
        return self


    def __exit__(self, exc_type, exc_value, traceback):
        self.conn.close()

def start_JobEnded_consumer():

    def callbackForMessageRecieved(ch, method, properties, body):
        print(" [x] %r:%r consumed" % (method.routing_key, body))
        #ChatConsumer.state['Running_Jobs'].remove({}) is working
        ChatConsumer.state['Running_Jobs'].pop(0)
        messageToSend = {
            "state" : ChatConsumer.state,
            "jobEnded" : body.decode('utf-8')

        }
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'notifications_room_group',
            {
                'type': 'send_message_to_frontend',
                'message': messageToSend
            }
        )


    consumer =  EnvironnementJobEnded()


    consumer.consumeQueue(keys=[''], callback=callbackForMessageRecieved)
