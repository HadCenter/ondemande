from django.db import models
import os
# Create your models here.
def upload_to(instance, filename):
    return 'files/{filename}'.format(filename=filename)

class Client(models.Model):
    code_client = models.CharField(max_length=200)
    nom_client = models.CharField(max_length=200, unique=True)
    email = models.EmailField(max_length=100 , blank= True)
    archived = models.BooleanField(default= False)

    def __str__(self):
        return self.nom_client
class EDIfile(models.Model):
    file = models.FileField(blank = False, null = False, upload_to=upload_to)
    created_at = models.DateTimeField(auto_now =True)
    '''en attente, en cours, complété '''
    status = models.CharField(max_length=200,default= 'En attente')
    wrong_commands = models.CharField(max_length=200, default="_")
    validated_orders = models.CharField(max_length=200, default="_")
    archived = models.BooleanField(default= False)
    cliqued = models.BooleanField(default= False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    # code_client = models.CharField(max_length=200)
    # client = models.CharField(max_length=200)
    def __str__(self):
        return os.path.basename(self.file.name)
