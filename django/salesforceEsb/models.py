from django.db import models

class ChangeDataBaseObject:
    def __init__(self,objectName,ObjectAction,ObjectToSendToDB):
        self.objectName = objectName
        self.ObjectAction = ObjectAction
        self.ObjectToSendToDB = ObjectToSendToDB