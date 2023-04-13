import uuid
import json

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.core.files.base import ContentFile
from .forms import UploadVideoForm
from .models import Video

import whisper_timestamped as whisper
import moviepy.editor

SMALL = 0.1  # Number of seconds for two cuts to count as one

# Load a model:

model = whisper.load_model("base")


def merge_times(times):
    """
    Merges a list of times.

    The idea is to convert two cuts with a small
    time diff into one cut to avoid awkward cuts.

    :param times: List of times
    :type times: List[Tuple(int, int)]
    """

    final = []
    last = [0, 0]
    index = -1

    # Iterate over all times:

    while index < len(times) - 1:

        # Determine if we need to merge

        if times[index+1][0] - last[1] < SMALL:

            # Set last:

            last = [last[0], times[index+1][1]]

        # Otherwise, just set last:

        else:

            # Determine if we should add to final:

            if last[0] != last[1]:

                # Add value to final:

                final.append(last)

            # Set last:

            last = times[index+1]

        # Increment index:

        index += 1

    # Finally, add last to list:

    final.append(last)

    return final


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

        cuts = json.loads(request.POST['cuts'])['timestamps']

        # Sort by start value:

        cuts.sort(key=lambda x: x[0])

        print("Original Cut: {}".format(cuts))

        if len(cuts) >= 2:

            cuts = merge_times(cuts)

        print(cuts)

        # Create video model and blank file:

        nvideo = Video()
        nvideo.video.save(str(uuid.uuid4()) + '.mp4', ContentFile(''))
        nvideo.save()

        # Load the video:

        clip = moviepy.editor.VideoFileClip(video.video.path)

        total_removed = 0

        # Iterate over each cut:

        for cut in cuts:
            print(f"Current timestamp: {cut}")

            # clip = clip.cutout(cut[0] - total_removed, cut[1] - total_removed)

            duration = clip.duration

            first_clip = clip.subclip(0, cut[0] - total_removed)
            second_clip = clip.subclip(cut[1] - total_removed, duration)

            clip = moviepy.editor.concatenate_videoclips([first_clip, second_clip])

            total_removed += cut[1] - cut[0]

        # Save video to memory:

        clip.write_videofile(nvideo.video.path)

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
