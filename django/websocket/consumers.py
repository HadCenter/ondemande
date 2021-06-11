# chat/consumers.py
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = 'notifications_room'
        self.room_group_name = self.room_name+"_group"
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
        self.send(text_data= "you are connected")

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None):
        print(" MESSAGE RECEIVED")
        data = json.loads(text_data)
        message = data['message']
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {
                "type": 'send_message_to_frontend',
                "message": message
            }
        )

    def send_message_to_frontend(self, notification):
        print("NOTIFICATION TRIGERED")
        # Receive message from room group
        message = notification['message']
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))