# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from salesforce import models


class Contact(models.Model):
    is_deleted = models.BooleanField(db_column='IsDeleted', verbose_name='Deleted', sf_read_only=models.READ_ONLY, default=False)
    master_record = models.ForeignKey('self', models.DO_NOTHING, db_column='MasterRecordId', related_name='contact_masterrecord_set', verbose_name='Master Record ID', sf_read_only=models.READ_ONLY, blank=True, null=True)
    last_name = models.CharField(db_column='LastName', max_length=80)
    first_name = models.CharField(db_column='FirstName', max_length=40, blank=True, null=True)
    salutation = models.CharField(db_column='Salutation', max_length=40, choices=[('Mr.', 'Mr.'), ('Ms.', 'Ms.'), ('Mrs.', 'Mrs.'), ('Dr.', 'Dr.'), ('Prof.', 'Prof.')], blank=True, null=True)
    middle_name = models.CharField(db_column='MiddleName', max_length=40, blank=True, null=True)
    suffix = models.CharField(db_column='Suffix', max_length=40, blank=True, null=True)
    name = models.CharField(db_column='Name', max_length=121, verbose_name='Full Name', sf_read_only=models.READ_ONLY)
    mailing_street = models.TextField(db_column='MailingStreet', blank=True, null=True)
    mailing_city = models.CharField(db_column='MailingCity', max_length=40, blank=True, null=True)
    mailing_state = models.CharField(db_column='MailingState', max_length=80, verbose_name='Mailing State/Province', blank=True, null=True)
    mailing_postal_code = models.CharField(db_column='MailingPostalCode', max_length=20, verbose_name='Mailing Zip/Postal Code', blank=True, null=True)
    mailing_country = models.CharField(db_column='MailingCountry', max_length=80, blank=True, null=True)
    mailing_latitude = models.DecimalField(db_column='MailingLatitude', max_digits=18, decimal_places=15, blank=True, null=True)
    mailing_longitude = models.DecimalField(db_column='MailingLongitude', max_digits=18, decimal_places=15, blank=True, null=True)
    mailing_geocode_accuracy = models.CharField(db_column='MailingGeocodeAccuracy', max_length=40, choices=[('Address', 'Address'), ('NearAddress', 'NearAddress'), ('Block', 'Block'), ('Street', 'Street'), ('ExtendedZip', 'ExtendedZip'), ('Zip', 'Zip'), ('Neighborhood', 'Neighborhood'), ('City', 'City'), ('County', 'County'), ('State', 'State'), ('Unknown', 'Unknown')], blank=True, null=True)
    mailing_address = models.TextField(db_column='MailingAddress', sf_read_only=models.READ_ONLY, blank=True, null=True)  # This field type is a guess.
    phone = models.CharField(db_column='Phone', max_length=40, verbose_name='Business Phone', blank=True, null=True)
    fax = models.CharField(db_column='Fax', max_length=40, verbose_name='Business Fax', blank=True, null=True)
    mobile_phone = models.CharField(db_column='MobilePhone', max_length=40, blank=True, null=True)
    reports_to = models.ForeignKey('self', models.DO_NOTHING, db_column='ReportsToId', related_name='contact_reportsto_set', verbose_name='Reports To ID', blank=True, null=True)
    email = models.EmailField(db_column='Email', blank=True, null=True)
    title = models.CharField(db_column='Title', max_length=128, blank=True, null=True)
    department = models.CharField(db_column='Department', max_length=80, blank=True, null=True)
    created_date = models.DateTimeField(db_column='CreatedDate', sf_read_only=models.READ_ONLY)
    last_modified_date = models.DateTimeField(db_column='LastModifiedDate', sf_read_only=models.READ_ONLY)
    system_modstamp = models.DateTimeField(db_column='SystemModstamp', sf_read_only=models.READ_ONLY)
    last_activity_date = models.DateField(db_column='LastActivityDate', verbose_name='Last Activity', sf_read_only=models.READ_ONLY, blank=True, null=True)
    last_curequest_date = models.DateTimeField(db_column='LastCURequestDate', verbose_name='Last Stay-in-Touch Request Date', sf_read_only=models.READ_ONLY, blank=True, null=True)
    last_cuupdate_date = models.DateTimeField(db_column='LastCUUpdateDate', verbose_name='Last Stay-in-Touch Save Date', sf_read_only=models.READ_ONLY, blank=True, null=True)
    last_viewed_date = models.DateTimeField(db_column='LastViewedDate', sf_read_only=models.READ_ONLY, blank=True, null=True)
    last_referenced_date = models.DateTimeField(db_column='LastReferencedDate', sf_read_only=models.READ_ONLY, blank=True, null=True)
    email_bounced_reason = models.CharField(db_column='EmailBouncedReason', max_length=255, blank=True, null=True)
    email_bounced_date = models.DateTimeField(db_column='EmailBouncedDate', blank=True, null=True)
    is_email_bounced = models.BooleanField(db_column='IsEmailBounced', sf_read_only=models.READ_ONLY, default=False)
    photo_url = models.URLField(db_column='PhotoUrl', verbose_name='Photo URL', sf_read_only=models.READ_ONLY, blank=True, null=True)
    jigsaw = models.CharField(db_column='Jigsaw', max_length=20, verbose_name='Data.com Key', blank=True, null=True)
    jigsaw_contact_id = models.CharField(db_column='JigsawContactId', max_length=20, verbose_name='Jigsaw Contact ID', sf_read_only=models.READ_ONLY, blank=True, null=True)
    rl_accounting_mail = models.CharField(db_column='RL_AccountingMail__c', max_length=100, verbose_name='Accounting Mail', blank=True, null=True)
    rl_agency = models.CharField(db_column='RL_Agency__c', max_length=45, verbose_name='Agency', blank=True, null=True)
    rl_bank_code = models.CharField(db_column='RL_BankCode__c', max_length=45, verbose_name='Bank Code', blank=True, null=True)
    rl_bank_key = models.CharField(db_column='RL_BankKey__c', max_length=45, verbose_name='Bank Key', blank=True, null=True)
    rl_billing_city = models.CharField(db_column='RL_BillingCity__c', max_length=45, verbose_name='Billing City', blank=True, null=True)
    rl_billing_country = models.CharField(db_column='RL_BillingCountry__c', max_length=45, verbose_name='Billing Country', blank=True, null=True)
    rl_billing_name = models.CharField(db_column='RL_BillingName__c', max_length=45, verbose_name='Billing Name', blank=True, null=True)
    rl_billing_street_number = models.CharField(db_column='RL_BillingStreetNumber__c', max_length=45, verbose_name='Billing Street Number', blank=True, null=True)
    rl_billing_street = models.CharField(db_column='RL_BillingStreet__c', max_length=45, verbose_name='Billing Street', blank=True, null=True)
    rl_billing_tel1 = models.CharField(db_column='RL_BillingTel1__c', max_length=45, verbose_name='Billing Tel1', blank=True, null=True)
    rl_billing_tel2 = models.CharField(db_column='RL_BillingTel2__c', max_length=45, verbose_name='Billing Tel2', blank=True, null=True)
    rl_billing_tel3 = models.CharField(db_column='RL_BillingTel3__c', max_length=45, verbose_name='Billing Tel3', blank=True, null=True)
    rl_code_settlement = models.DecimalField(db_column='RL_CodeSettlement__c', max_digits=11, decimal_places=0, verbose_name='Code Settlement', blank=True, null=True)
    rl_created_at = models.DateTimeField(db_column='RL_CreatedAt__c', verbose_name='Created At', blank=True, null=True)
    rl_email = models.CharField(db_column='RL_Email__c', max_length=255, verbose_name='Email', blank=True, null=True)
    rl_external_account_id = models.DecimalField(db_column='RL_ExternalAccountId__c', max_digits=18, decimal_places=0, verbose_name='External AccountId', blank=True, null=True)
    rl_external_id = models.DecimalField(db_column='RL_ExternalId__c', max_digits=18, decimal_places=0, verbose_name='External Id', blank=True, null=True)
    rl_is_active = models.DecimalField(db_column='RL_IsActive__c', max_digits=1, decimal_places=0, verbose_name='Is Active', blank=True, null=True)
    rl_recovery_postal_code = models.CharField(db_column='RL_RecoveryPostalCode__c', max_length=255, verbose_name='Recovery Postal Code', blank=True, null=True)
    rl_removal_street_number = models.CharField(db_column='RL_RemovalStreetNumber__c', max_length=45, verbose_name='Removal Street Number', blank=True, null=True)
    rl_removal_tel3 = models.CharField(db_column='RL_RemovalTel3__c', max_length=40, verbose_name='Removal Tel3', blank=True, null=True)
    code_client = models.CharField(db_column='Code_Client__c', max_length=30, verbose_name='Code Client', blank=True, null=True)
    data_quality_description = models.CharField(db_column='Data_Quality_Description__c', max_length=1300, verbose_name='Data Quality Description', sf_read_only=models.READ_ONLY, blank=True, null=True)
    data_quality_score = models.DecimalField(db_column='Data_Quality_Score__c', max_digits=18, decimal_places=0, verbose_name='Data Quality Score', sf_read_only=models.READ_ONLY, blank=True, null=True)
    rl_is_modified = models.BooleanField(db_column='RL_Is_Modified__c', verbose_name='Is Modified', default=models.DefaultedOnCreate(False))
    rl_tarification_par_palier = models.BooleanField(db_column='RL_Tarification_par_palier__c', verbose_name='Tarification par palier', default=models.DefaultedOnCreate(False))
    rl_archived = models.BooleanField(db_column='RL_Archived__c', verbose_name='RL_Archived', default=models.DefaultedOnCreate(False))
    rl_removal_iso3_country = models.CharField(db_column='RL_Removal_iso3_country__c', max_length=45, verbose_name='RL_Removal_iso3_country', blank=True, null=True)
    rl_company = models.CharField(db_column='RL_Company__c', max_length=45, verbose_name='RL_Company', blank=True, null=True)
    tdc_tsw_phone_status = models.CharField(db_column='tdc_tsw__Phone_Status__c', max_length=1300, verbose_name='Phone Status', sf_read_only=models.READ_ONLY, blank=True, null=True)
    tdc_tsw_phone_verification_status = models.CharField(db_column='tdc_tsw__Phone_Verification_Status__c', max_length=255, verbose_name='Number Verification Status', choices=[('Valid', 'Valid'), ('Invalid', 'Invalid')], blank=True, null=True)
    tdc_tsw_phone_verify_result_msg = models.CharField(db_column='tdc_tsw__Phone_Verify_Result_Msg__c', max_length=255, verbose_name='Number Verify Result Msg', blank=True, null=True)
    tdc_tsw_sms_opt_out = models.BooleanField(db_column='tdc_tsw__SMS_Opt_out__c', verbose_name='SMS Opt out', default=models.DefaultedOnCreate(False))
    tdc_tsw_type = models.CharField(db_column='tdc_tsw__Type__c', max_length=200, verbose_name='Type', blank=True, null=True)
    tdc_tsw_verified_phone = models.CharField(db_column='tdc_tsw__Verified_Phone__c', max_length=255, verbose_name='Verified Number', blank=True, null=True)
    tdc_tsw_result = models.CharField(db_column='tdc_tsw__result__c', max_length=100, verbose_name='result', blank=True, null=True)
    class Meta(models.Model.Meta):
        db_table = 'Contact'
        verbose_name = 'Contact'
        verbose_name_plural = 'Contacts'
        # keyPrefix = '003'

