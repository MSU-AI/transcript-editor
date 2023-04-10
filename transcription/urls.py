from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views
from .signals import delete_folder
delete_folder()

urlpatterns = [
    path('', views.index, name='index'),
    path('video-editing/', views.index2, name='index2'),
    path('uploads/', views.upload_file, name='upload_file'),
    path('api/transcribe/', views.transcribe, name='transcribe'),
    path('api/upload/', views.upload_file, name='upload'),
    path('api/get/', views.get_file, name='get_file'),
    path('api/cut/', views.cut_file, name='cut_file'),
    path('api/delete/', views.delete_file, name='delete_file'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
