# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AccountsAccount(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    email = models.CharField(unique=True, max_length=254)
    username = models.CharField(max_length=255)
    is_active = models.IntegerField()
    is_staff = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    role = models.CharField(max_length=200)

    class Meta:
        managed = False
        db_table = 'accounts_account'


class AccountsAccountGroups(models.Model):
    account = models.ForeignKey(AccountsAccount, models.DO_NOTHING)
    group = models.ForeignKey('AuthGroup', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'accounts_account_groups'
        unique_together = (('account', 'group'),)


class AccountsAccountUserPermissions(models.Model):
    account = models.ForeignKey(AccountsAccount, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'accounts_account_user_permissions'
        unique_together = (('account', 'permission'),)


class AnomaliesEdiFileAnnuaire(models.Model):
    id_anomalie = models.AutoField(primary_key=True)
    label = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'anomalies_edi_file_annuaire'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=80)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class CoreClient(models.Model):
    code_client = models.CharField(max_length=200)
    nom_client = models.CharField(max_length=200)
    email = models.CharField(max_length=100, blank=True, null=True)
    archived = models.IntegerField(blank=True, null=True)
    id_salesforce = models.CharField(unique=True, max_length=200)

    class Meta:
        managed = False
        db_table = 'core_client'


class CoreEdifile(models.Model):
    file = models.CharField(max_length=100)
    created_at = models.DateTimeField()
    status = models.CharField(max_length=200)
    wrong_commands = models.CharField(max_length=200)
    validated_orders = models.CharField(max_length=200)
    archived = models.IntegerField()
    cliqued = models.IntegerField()
    client_id = models.IntegerField()
    number_wrong_commands = models.IntegerField()
    number_correct_commands = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'core_edifile'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AccountsAccount, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class HistoryAnomaliesEdiFiles(models.Model):
    edi_file_id = models.IntegerField(blank=True, null=True)
    execution_time = models.DateTimeField(blank=True, null=True)
    anomalie_id = models.IntegerField(blank=True, null=True)
    number_of_anomalies = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'history_anomalies_edi_files'


class KnoxAuthtoken(models.Model):
    digest = models.CharField(primary_key=True, max_length=128)
    salt = models.CharField(unique=True, max_length=16)
    created = models.DateTimeField()
    user = models.ForeignKey(AccountsAccount, models.DO_NOTHING)
    expiry = models.DateTimeField(blank=True, null=True)
    token_key = models.CharField(max_length=8)

    class Meta:
        managed = False
        db_table = 'knox_authtoken'



