from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views
from .views import upload_file

urlpatterns = [
    path('', views.index, name='index'),
    path('video-editing/', views.index2, name='index2'),
    path('uploads/', upload_file, name='upload_file'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)