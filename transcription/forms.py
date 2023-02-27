# helpers.py

from django.core.files.storage import FileSystemStorage

def handle_uploaded_file(f):
    fs = FileSystemStorage(location='uploads/')
    filename = fs.save(f.name, f)
    return filename
