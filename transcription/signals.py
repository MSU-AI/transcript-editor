import os
import shutil
from django.conf import settings


def delete_folder():
    folder_path = os.path.join(settings.BASE_DIR, 'uploads')
    if os.path.exists(folder_path):
        shutil.rmtree(folder_path)
