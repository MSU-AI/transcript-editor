# from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
from .models import UserUpload
from .forms import VideoForm

def showvideo(request):


    form= VideoForm(request.POST, request.FILES)
    if form.is_valid():
        form.save()
    
    context= {
        'form': form
    }
    
      
    return render(request, 'video-editing.html', context)

def index(request):
    return HttpResponse("Hello, world. You're at the transcription index.")

