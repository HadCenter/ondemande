from django.shortcuts import render
import datetime
import ftplib
import logging
import os
import re
import shutil
import time
from os import listdir
from os.path import isfile, join

import jsonpickle
import numpy as np
import pandas as pd
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework_swagger.views import get_swagger_view
# Create your views here.
import pika
import threading
from rabbitMQ.PikaMassenger import start_consumer
from rabbitMQ.EnvironnementJobEnded import start_JobEnded_consumer

credentials = pika.PlainCredentials('admin', 'password')
#connection = pika.BlockingConnection(pika.ConnectionParameters(host='52.47.208.8',port= 5672 ,credentials = credentials) )
#connection = pika.BlockingConnection(pika.URLParameters('amqp://admin:password@52.47.208.8:5672/%2F') )
# connection = pika.BlockingConnection(pika.URLParameters('amqps://ucuvenkg:g8SXY-tERqixsWjG1PL6N-BP98jsU5fH@rat.rmq2.cloudamqp.com/ucuvenkg'))

# channel = connection.channel()

#channel.queue_declare(queue='converge.queue.job.start',durable=True)
# consumer_thread = threading.Thread(target=start_consumer)
# consumer_thread2 = threading.Thread(target=start_JobEnded_consumer)
#thead 1 ordonnanceur
# consumer_thread.start()
#thread 2 actualisation automatique
#desactiver thread 1 et 2 sur localhost
# consumer_thread2.start()


# def sendMessageRabbitMqToStartJob(message : str):
#     global connection
#     global channel
#     try:
#         channel.basic_publish(exchange='job.to.start',
#                               routing_key='',
#                               body=message)
#     except :

#         if connection.is_closed :
#             connection = pika.BlockingConnection(pika.URLParameters('amqps://ucuvenkg:g8SXY-tERqixsWjG1PL6N-BP98jsU5fH@rat.rmq2.cloudamqp.com/ucuvenkg'))
#         if channel.is_closed:
#             channel = connection.channel()
#         channel.basic_publish(exchange='job.to.start',
#                           routing_key='',
#                           body=message)

