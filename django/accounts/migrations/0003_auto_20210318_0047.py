# Generated by Django 2.1.5 on 2021-03-18 00:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_auto_20210318_0032'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='updated_at',
            field=models.DateTimeField(null=True),
        ),
    ]