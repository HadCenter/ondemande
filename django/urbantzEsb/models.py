from django.db import models

# Create your models here.

class UrbantzTask:
    def __init__(self,type,taskId,taskReference,client,date,timeWindow,timeWindow2,contact,address,items,metadata,requires = {},categories=[],collect = {},product="string",products = [],hasBeenPaid = False,notificationSettings = {},collectedAmount = 0,price = 0,round = "",sequence = 1 ,instructions = "" ,serviceTime = 0 ,maxTransitTime = 0 ):
        self.type = type
        self.taskId = taskId
        self.taskReference = taskReference
        self.product = product
        self.products = products
        self.hasBeenPaid = hasBeenPaid
        self.notificationSettings = notificationSettings
        self.client = client
        self.collectedAmount = collectedAmount
        self.price = price
        self.round = round
        self.sequence = sequence
        self.instructions = instructions
        self.date = date
        self.serviceTime = serviceTime
        self.maxTransitTime = maxTransitTime
        self.timeWindow = timeWindow
        self.timeWindow2 = timeWindow2
        self.contact = contact
        self.address = address
        self.items = items
        self.requires = requires
        self.metadata = metadata
        self.categories = categories
        self.collect = collect

class TaskItem:
    def __init__(self,type,name,description,barcodeEncoding,reference,quantity,conditionalChecklists=[],group ="string",barcode = "",metadata ={},dimensions = {"volume": 0.01,"weight": 1},labels=[],skills=[]):
        self.type =type
        self.name =name
        self.description =description
        self.barcode =barcode
        self.barcodeEncoding =barcodeEncoding
        self.reference =reference
        self.quantity =quantity
        self.dimensions =dimensions
        self.labels =labels
        self.skills =skills
        self.metadata =metadata
        self.conditionalChecklists =conditionalChecklists
        self.group = group

class Metadata :
    def __init__(self,CodeArticle,Porte,Instructions,Tel3):
        self.CodeArticle = CodeArticle
        self.Porte = Porte
        self.Instructions = Instructions
        self.Tel3 = Tel3

class ContactUrbantz :
    def __init__(self,name,phone,email,buildingInfo,extraPhones = [],extraEmails = [],language = "fr",account ="",person =""):
        self.account = account
        self.name = name
        self.person =person
        self.phone = phone
        self.email = email
        self.extraPhones = extraPhones
        self.extraEmails =extraEmails
        self.language = language
        self.buildingInfo =buildingInfo

class BuildingInfoUrbantz :
    def __init__(self,floor,hasElevator,digicode2,hasInterphone,interphoneCode,digicode1 = ""):
        self.floor =floor
        self.hasElevator =hasElevator
        self.digicode1 =digicode1
        self.digicode2 = digicode2
        self.hasInterphone =hasInterphone
        self.interphoneCode = interphoneCode

class LocationUrbantz :
    def __init__(self,number,street,city,zip,address,addressLines=[],cleanScore =0,geocodeScore = 100,building ="",country = "France",origin=""):
        self.building = building
        self.number =number
        self.street =street
        self.city = city
        self.zip = zip
        self.origin = origin
        self.country = country
        self.address = address
        self.addressLines = addressLines
        self.cleanScore = cleanScore
        self.geocodeScore = geocodeScore


class TimeWindowUrbantz:
    def __init__(self,start,stop):
        self.start = start
        self.stop = stop
