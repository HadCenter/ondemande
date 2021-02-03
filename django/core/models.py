from django.db import models
import os
# Create your models here.


class Client(models.Model):
    code_client = models.CharField(max_length=200)
    nom_client = models.CharField(max_length=200, unique=True)
    email = models.EmailField(max_length=100)

    def __str__(self):
        return self.nom_client

class EDIfile(models.Model):
    file = models.FileField(upload_to="dishes/chinese")
    created_at = models.DateTimeField(auto_now =True)
    '''en attente, en cours, complété '''
    status = models.BooleanField(default=False)
    wrong_commands = models.CharField(max_length=200, default="_")
    validated_orders = models.CharField(max_length=200, default="_")
    client = models.ForeignKey(Client, on_delete=models.CASCADE)

    def __str__(self):
        return os.path.basename(self.file.name)
