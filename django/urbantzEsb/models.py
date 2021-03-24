from django.db import models

# Create your models here.

class UrbantzTask:
    def __init__(self,type,taskId,taskReference,product,products,hasBeenPaid,notificationSettings,client,collectedAmount,price,round,sequence,instructions,date,serviceTime,maxTransitTime,timeWindow,timeWindow2,contact,address,items,requires,metadata,categories,collect):
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
    def __init__(self,type,name,description,barcode,barcodeEncoding,reference,quantity,dimensions,labels,skills,metadata,conditionalChecklists,group):
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
    def __init__(self,codeArticle):
        self.codeArticle = codeArticle

class ContactUrbantz :
    def __init__(self,account,name,person,phone,email,extraPhones,extraEmails,language,buildingInfo):
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
    def __init__(self,floor,hasElevator,digicode1,digicode2,hasInterphone,interphoneCode):
        self.floor =floor
        self.hasElevator =hasElevator
        self.digicode1 =digicode1
        self.digicode2 = digicode2
        self.hasInterphone =hasInterphone
        self.interphoneCode = interphoneCode

class LocationUrbantz :
    def __init__(self,building,number,street,city,zip,origin,country,location,address,addressLines,cleanScore,geocodeScore):
        self.building = building
        self.number =number
        self.street =street
        self.city = city
        self.zip = zip
        self.origin = origin
        self.country = country
        self.location = location
        self.address = address
        self.addressLines = addressLines
        self.cleanScore = cleanScore
        self.geocodeScore = geocodeScore