from django.db import models

class ChangeDataBaseObject:
    def __init__(self,objectName,objectAction,objectToSendToDB):
        self.objectName = objectName
        self.objectAction = objectAction
        self.objectToSendToDB = objectToSendToDB