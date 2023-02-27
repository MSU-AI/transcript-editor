# from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
from .forms import handle_uploaded_file


def index(request):
    return render(request, 'Frontend/Home.html')

def index2(request):
    return render(request, 'Frontend/video-editing.html')


def upload_file(request):
    if request.method == 'POST':
        uploaded_file = request.FILES['file']
        handle_uploaded_file(uploaded_file)
        return HttpResponse(status=204) # Return a "No Content" response

