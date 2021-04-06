# Generated by Django 2.1.5 on 2021-04-05 03:02

import core.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code_client', models.CharField(max_length=200)),
                ('nom_client', models.CharField(max_length=200, unique=True)),
                ('email', models.EmailField(blank=True, max_length=100)),
                ('archived', models.BooleanField(default=False)),
                ('id_salesforce', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='EDIfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to=core.models.upload_to)),
                ('created_at', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(default='En attente', max_length=200)),
                ('wrong_commands', models.CharField(default='_', max_length=200)),
                ('validated_orders', models.CharField(default='_', max_length=200)),
                ('archived', models.BooleanField(default=False)),
                ('cliqued', models.BooleanField(default=False)),
                ('number_correct_commands', models.IntegerField(default=0)),
                ('number_wrong_commands', models.IntegerField(default=0)),
                ('client', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='files', to='core.Client')),
            ],
        ),
    ]
