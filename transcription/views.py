import uuid
import json

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.core.files.base import ContentFile
from .forms import UploadVideoForm
from .models import Video

import whisper_timestamped as whisper
import moviepy.editor


# Load a model:

model = whisper.load_model("base")


def index(request):
    return render(request, 'Frontend/Home.html')


def index2(request):
    return render(request, 'Frontend/video-editing.html')


def upload_file(request):

    if request.method == 'POST':

        print("In POST")

        # Create a form from the given request:

        print("Request: {}".format(request))
        print(request.POST)
        print(request.FILES)

        form = UploadVideoForm(request.POST, request.FILES)

        # Ensure it is valid:

        if form.is_valid():

            print("Is Valid")

            # Form is valid, save:

            model = form.save()

            print(model.video.path)

            # Next, return the ID to the user:

            return JsonResponse({'video-id': model.id})


def transcribe(request):

    if request.method == 'POST':

        # Determine in ID:

        id = request.POST['id']

        # Grab the file in question:

        video = Video.objects.filter(id=id)[0]

        # Now, transcode the file:

        audio = whisper.load_audio(video.video.path)

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

        return JsonResponse(output)


def get_file(request):

    if request.method == 'POST':

        # Determine the ID:

        id = request.POST['id']

        # Grab the file:

        video = Video.objects.filter(id=id)[0]

        # Return the URL to the file:

        return JsonResponse({'url': video.video.url})


def cut_file(request):

    if request.method == 'POST':

        # Determine the ID:

        id = request.POST['id']

        # Grab the file:

        video = Video.objects.filter(id=id)[0]

        # Get the start and stop time:

        first_time = float(request.POST['start'])
        second_time = float(request.POST['stop'])

        print("First time: {}".format(first_time))
        print("Second time: {}".format(second_time))

        # Create video model and blank file:

        nvideo = Video()
        nvideo.video.save(str(uuid.uuid4()) + '.mp4', ContentFile(''))
        nvideo.save()

        # Create and clip the video:

        clip = moviepy.editor.VideoFileClip(video.video.path)

        # Cut the segment out of the clip:

        nclip = clip.cutout(first_time, second_time)

        # Path to cut video:

        nclip.write_videofile(nvideo.video.path)

        print(nclip.duration)
        print(clip.duration)

        clip.close()
        nclip.close()

        return JsonResponse({'id': nvideo.id})


def cut_files(request):

    if request.method == 'POST':

        # Determine the ID:

        id = request.POST['id']

        # Grab the file:

        video = Video.objects.filter(id=id)[0]

        # Decode the cuts:

        cuts = json.loads(request.POST['cuts'])

        # Create video model and blank file:

        nvideo = Video()
        nvideo.video.save(str(uuid.uuid4()) + '.mp4', ContentFile(''))
        nvideo.save()

        # Load the video:

        clip = moviepy.editor.VideoFileClip(video.video.path)

        # Iterate over each cut:

        for cut in cuts['timestamps']:

            duration = clip.duration

            first_clip = clip.subclip(0, cut[0])
            second_clip = clip.subclip(cut[1], duration)

            final_clip = moviepy.editor.concatenate_videoclips([first_clip, second_clip])

        # Save video to memory:

        final_clip.write_videofile(nvideo.video.path)

        return JsonResponse({'id': nvideo.id})


def delete_file(request):

    if request.method == 'POST':

        # Determine the ID:

        id = request.POST['id']

        # Grab the file:

        video = Video.objects.filter(id=id)[0]

        # Delete the video:

        video.video.delete()

        video.delete()

        return JsonResponse({'deleted': True})
