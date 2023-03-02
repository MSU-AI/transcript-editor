# helpers.py

from django.core.files.storage import FileSystemStorage
from django import forms

class UploadVideoForm(forms.Form):
    file = forms.FileField()

def handle_uploaded_file(f):
    fs = FileSystemStorage(location='uploads/')
    filename = fs.save(f.name, f)
    return filename
