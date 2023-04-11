from django.db import models
from django.utils.timezone import now


class Video(models.Model):

    # Date image was added
    date = models.DateTimeField("date updated", auto_now_add=True)

    # Video field containing uploaded video
    video = models.FileField(upload_to="uploads")
