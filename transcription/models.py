from django.db import models

# Create your models here.
class Video(models.Model):
    UserVideo = models.FileField(upload_to="video/%y")
    def __str__(self):
        return self.caption
