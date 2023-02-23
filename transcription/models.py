from django.db import models

# Create your models here.
class UserUpload(models.Model):
    UserVideo = models.FileField( blank=True, null=True)