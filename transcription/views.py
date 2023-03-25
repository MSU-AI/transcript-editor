from os import remove

# from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from .forms import handle_uploaded_file, UploadVideoForm

import whisper_timestamped as whisper

# Load a model:

model = whisper.load_model("base")

def index(request):
    return render(request, 'Frontend/Home.html')

def index2(request):
    return render(request, 'Frontend/video-editing.html')


def upload_file(request):
    if request.method == 'POST':

        print("In post")
        print(request)
        print(request.FILES)

        form = UploadVideoForm(request.POST, request.FILES)

        if form.is_valid():

            print("File is valid")

            filename, file = handle_uploaded_file(request.FILES["file"])

            # Now, transcode the file:

            audio = whisper.load_audio("uploads/" + filename)

            result = whisper.transcribe(model, audio)

            output = {"timestamps": []}

            for seg in result['segments']:

                # Determine the text spoken:

                text = seg['text']

                # Determine the time this segment started at:

                start = seg['start']

                # Next, get the words:

                words = seg['words']

                # Save the data to a final dictionary:

                output['timestamps'].append({'text': text, 'start_time': start, 'words': words})

                # Finally, delete the file:

                file.delete(filename)

        return JsonResponse(output) # Return a "No Content" response
