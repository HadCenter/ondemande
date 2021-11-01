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


from core.models import AnomaliesEdiFileAnnuaire, HistoryAnomaliesEdiFiles
from core.models import Client, AllMadFileContent, InterventionAdmin, kpi4WithFiltersDto, kpi2WithFiltersDto
from core.models import EDIfile
from core.models import FileExcelContent
from core.models import FileInfo, Contact, kpi3SchemaSingleAnomalie, getNumberOfAnomaliesPerDateDTO, \
    getNumberOfAnomaliesWithFiltersDTO
from core.serializers import ClientSerializer, ClientTestSerialize

# Create your views here.
@api_view(['GET'])
def kpi3(request):
    historyanomalies = HistoryAnomaliesEdiFiles.objects.all().prefetch_related("anomalie").prefetch_related("edi_file").prefetch_related("edi_file__client")
    listAnomaliesToReturn = []
    for anomaly in historyanomalies:
        listAnomaliesToReturn.append(
            kpi3SchemaSingleAnomalie(anomalie_id=anomaly.id, number_of_anomalies=anomaly.number_of_anomalies,
                                     execution_time=anomaly.execution_time, edi_file_id=anomaly.edi_file.id,
                                     client_id=anomaly.edi_file.client.id,
                                     client_name=anomaly.edi_file.client.nom_client,
                                     client_code=anomaly.edi_file.client.code_client,
                                     edi_file_name=anomaly.edi_file.file.name, anomalie_name=anomaly.anomalie.label))
    return HttpResponse(jsonpickle.encode(listAnomaliesToReturn, unpicklable=False), content_type='applicaiton/json')


@api_view(['GET'])
def numberOfFilesPerClient(request):
    queryset = Client.objects.filter(archived=False)
    serializer_class = ClientTestSerialize(queryset, many=True)
    json_data = JSONRenderer().render(serializer_class.data)
    return HttpResponse(json_data, content_type='application/json')


@api_view(['POST'])
def getNumberOfAnomaliesPerDate(request):
    dateToFilter = request.data['date']
    historyanomalies = HistoryAnomaliesEdiFiles.objects.filter(execution_time=dateToFilter).prefetch_related(
        "anomalie").prefetch_related("edi_file")
    numberOfAnomaliestotal = 0
    for anomaly in historyanomalies:
        numberOfAnomaliestotal += anomaly.number_of_anomalies

    return HttpResponse(
        jsonpickle.encode(getNumberOfAnomaliesPerDateDTO(dateToFilter, numberOfAnomaliestotal), unpicklable=False),
        content_type='applicaiton/json')





@api_view(['GET'])
def getNumberOfAnomaliesPerDateAll(request):
    historyanomalies = HistoryAnomaliesEdiFiles.objects.order_by('execution_time').prefetch_related("anomalie").prefetch_related("edi_file")
    mapDateToNumberOfAnomalies = {}
    for anomaly in historyanomalies:
        if anomaly.execution_time.strftime("%m-%d-%Y %H:%M") not in mapDateToNumberOfAnomalies.keys():
            mapDateToNumberOfAnomalies[anomaly.execution_time.strftime("%m-%d-%Y %H:%M")] = 0

        mapDateToNumberOfAnomalies[anomaly.execution_time.strftime("%m-%d-%Y %H:%M")] += anomaly.number_of_anomalies

    return HttpResponse(jsonpickle.encode(mapDateToNumberOfAnomalies, unpicklable=False),
                        content_type='applicaiton/json')


@api_view(['GET'])
def getNumberOfInterventionsPerDateAll(request):
    interventionAdmin = InterventionAdmin.objects.order_by('execution_time').prefetch_related(
        "id_admin").prefetch_related("id_file_edi")
    mapDateToNumberOfInterventions = {}
    for intervention in interventionAdmin:
        if intervention.execution_time.strftime("%m-%d-%Y") not in mapDateToNumberOfInterventions.keys():
            mapDateToNumberOfInterventions[intervention.execution_time.strftime("%m-%d-%Y")] = 0

        mapDateToNumberOfInterventions[intervention.execution_time.strftime("%m-%d-%Y")] += 1

    return HttpResponse(jsonpickle.encode(mapDateToNumberOfInterventions, unpicklable=False),
                        content_type='applicaiton/json')


@api_view(['GET'])
def getNumberOfFilesPerDateAll(request):
    ediFiles = EDIfile.objects.order_by('created_at').prefetch_related("client")
    mapDateToNumberOfFiles = {}
    for edifile in ediFiles:
        if edifile.created_at.strftime("%m-%d-%Y") not in mapDateToNumberOfFiles.keys():
            mapDateToNumberOfFiles[edifile.created_at.strftime("%m-%d-%Y")] = 0

        mapDateToNumberOfFiles[edifile.created_at.strftime("%m-%d-%Y")] += 1

    return HttpResponse(jsonpickle.encode(mapDateToNumberOfFiles, unpicklable=False), content_type='applicaiton/json')


@api_view(['POST'])
def getNumberOfAnomaliesPerId(request):
    anomalie_id = request.data['anomalie_id']
    historyanomalies = HistoryAnomaliesEdiFiles.objects.filter(anomalie=anomalie_id).prefetch_related(
        "anomalie").prefetch_related("edi_file")
    numberOfAnomaliestotal = 0
    for anomaly in historyanomalies:
        numberOfAnomaliestotal += anomaly.number_of_anomalies

    return HttpResponse(
        jsonpickle.encode(getNumberOfAnomaliesPerDateDTO(anomalie_id, numberOfAnomaliestotal), unpicklable=False),
        content_type='applicaiton/json')


@api_view(['GET'])
def getNumberOfAnomaliesPerIdAll(request):
    historyanomalies = HistoryAnomaliesEdiFiles.objects.all().prefetch_related("anomalie").prefetch_related("edi_file")
    mapDateToNumberOfAnomalies = {}
    for anomaly in historyanomalies:
        if anomaly.anomalie.label not in mapDateToNumberOfAnomalies.keys():
            mapDateToNumberOfAnomalies[anomaly.anomalie.label] = 0

        mapDateToNumberOfAnomalies[anomaly.anomalie.label] += anomaly.number_of_anomalies

    return HttpResponse(jsonpickle.encode(mapDateToNumberOfAnomalies, unpicklable=False),
                        content_type='applicaiton/json')


@api_view(['POST'])
def getNumberOfAnomaliesWithFilters(request):
    dateFilter = request.data["dateFilter"]
    clientFilter = request.data["clientFilter"]
    anomalieFilter = request.data["anomalieFilter"]
    fileFilter = request.data["fileFilter"]

    historyanomalies = HistoryAnomaliesEdiFiles.objects.all().prefetch_related("anomalie").prefetch_related(
        "edi_file").prefetch_related("edi_file__client")

    if dateFilter != None:
        startDate: datetime = dateFilter['startDate']
        endDate: datetime = dateFilter['endDate']
        if startDate != None:
            historyanomalies = historyanomalies.filter(execution_time__gte=startDate)
        if endDate != None:
            historyanomalies = historyanomalies.filter(execution_time__lte=endDate)
    if (clientFilter != None) and (len(clientFilter) > 0):
        historyanomalies = historyanomalies.filter(edi_file__client__nom_client__in=clientFilter)
    if (fileFilter != None) and (len(fileFilter) > 0):
        historyanomalies = historyanomalies.filter(edi_file__file__in=fileFilter)
    if (anomalieFilter != None) and (len(anomalieFilter) > 0):
        historyanomalies = historyanomalies.filter(anomalie__label__in=anomalieFilter)
    mapDateToNumberOfAnomalies = {}
    mapIdToNumberOfAnomalies = {}
    for anomaly in historyanomalies:
        if anomaly.anomalie.label not in mapIdToNumberOfAnomalies.keys():
            mapIdToNumberOfAnomalies[anomaly.anomalie.label] = 0
        if anomaly.execution_time.strftime("%m-%d-%Y %H:%M:%S") not in mapDateToNumberOfAnomalies.keys():
            mapDateToNumberOfAnomalies[anomaly.execution_time.strftime("%m-%d-%Y %H:%M:%S")] = 0

        mapIdToNumberOfAnomalies[anomaly.anomalie.label] += anomaly.number_of_anomalies
        mapDateToNumberOfAnomalies[anomaly.execution_time.strftime("%m-%d-%Y %H:%M:%S")] += anomaly.number_of_anomalies

    return HttpResponse(
        jsonpickle.encode(getNumberOfAnomaliesWithFiltersDTO(mapIdToNumberOfAnomalies, mapDateToNumberOfAnomalies),
                          unpicklable=False), content_type='applicaiton/json')




@api_view(['POST'])
def getNumberOfInterventionsWithFilters(request):
    dateFilter = request.data["dateFilter"]
    clientFilter = request.data["clientFilter"]
    fileFilter = request.data["fileFilter"]

    interventionAdmin = InterventionAdmin.objects.all().prefetch_related("id_admin").prefetch_related(
        "id_file_edi").prefetch_related("id_file_edi__client")

    if dateFilter != None:
        startDate: datetime = dateFilter['startDate']
        endDate: datetime = dateFilter['endDate']
        if startDate != None:
            interventionAdmin = interventionAdmin.filter(execution_time__gte=startDate)
        if endDate != None:
            interventionAdmin = interventionAdmin.filter(execution_time__lte=endDate)
    if (fileFilter != None) and (len(fileFilter) > 0):
        interventionAdmin = interventionAdmin.filter(id_file_edi__file__in=fileFilter)
    if (clientFilter != None) and (len(clientFilter) > 0):
        interventionAdmin = interventionAdmin.filter(id_file_edi__client__nom_client__in=clientFilter)

    result = []
    for intervention in interventionAdmin:
        execution_time = intervention.execution_time.strftime("%m-%d-%Y")
        adminUserName = intervention.id_admin.username
        fileName = intervention.id_file_edi.file.name
        clientName = intervention.id_file_edi.client.nom_client
        item = kpi4WithFiltersDto(date=execution_time, fileName=fileName, clientName=clientName,
                                  AdminName=adminUserName)
        result.append(item)
    return HttpResponse(jsonpickle.encode(result, unpicklable=False), content_type='applicaiton/json')


@api_view(['POST'])
def getNumberOfFilesWithFilters(request):
    dateFilter = request.data["dateFilter"]
    clientFilter = request.data["clientFilter"]
    fileFilter = request.data["fileFilter"]

    ediFiles = EDIfile.objects.order_by('created_at').prefetch_related("client")
    if dateFilter != None:
        startDate: datetime = dateFilter['startDate']
        endDate: datetime = dateFilter['endDate']
        if startDate != None:
            ediFiles = ediFiles.filter(created_at__gte=startDate)
        if endDate != None:
            ediFiles = ediFiles.filter(created_at__lte=endDate)
    if (fileFilter != None) and (len(fileFilter) > 0):
        ediFiles = ediFiles.filter(file__in=fileFilter)
    if (clientFilter != None) and (len(clientFilter) > 0):
        ediFiles = ediFiles.filter(client__nom_client__in=clientFilter)

    result = []
    for edifile in ediFiles:
        execution_time = edifile.created_at.strftime("%m-%d-%Y")
        fileName = edifile.file.name
        clientName = edifile.client.nom_client
        item = kpi2WithFiltersDto(date=execution_time, fileName=fileName, clientName=clientName)
        result.append(item)
    return HttpResponse(jsonpickle.encode(result, unpicklable=False), content_type='applicaiton/json')
