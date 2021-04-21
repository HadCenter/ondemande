from django.db import models

# Create your models here.

class SendMadPostProcessPostObject:
    def __init__(self,transaction_id,client_code,end_date_plus_one,start_date,jobs_to_start):
        self.transaction_id = transaction_id
        self.client_code = client_code
        self.end_date_plus_one = end_date_plus_one
        self.start_date = start_date
        self.jobs_to_start = jobs_to_start


class TransactionsLivraison(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    statut = models.CharField(max_length=45, blank=True, null=True)
    fichier_livraison_sftp = models.CharField(max_length=100, blank=True, null=True)
    fichier_exception_sftp = models.CharField(max_length=100, blank=True, null=True)
    fichier_metadata_sftp = models.CharField(max_length=100, blank=True, null=True)
    fichier_mad_sftp = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'transactions_livraison'