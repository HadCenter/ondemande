# chat/consumers.py
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
import jsonpickle


class ChatConsumer(WebsocketConsumer):
    state = {
        "stateEdi": "table ediFile not updated",
        "stateTransaction" : "table transactionFile not updated",
        "stateLogistic" : "table logisticFile not updated",
        "statePowerbi" : "table powerbirtlog not updated"
    }
    def connect(self):
        self.room_name = 'notifications_room'
        self.room_group_name = self.room_name+"_group"
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
        self.send(text_data= jsonpickle.encode(ChatConsumer.state,unpicklable=False))

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
        self.send(text_data=json.dumps(
            message
        ))