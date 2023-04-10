# API Reference

This file contains documentation for the WIP API.

## Endpoints

- /api/upload - Uploads a video to the backend
- /api/get - Gets a certain video from the backend
- /api/cut - Cuts a video
- /api/transcribe - Transcribes a video
- /api/delete - Deletes a video from the backend

## upload

Uploads a video, and returns the ID attributed to the video.

### Data

POST request with following attributes:

- File with key "video" and value of video data

### Returns

JSON data with following attributes:

- ID of file under key `video-id`

Example response:

```json
{
    "video-id": [Int]
}
```

## get

Gets a download URL for a video.

### Data

POST request with the following attributes:

- `id` as key, ID of video to get as value

### Returns

JSON data with following attributes:

- URL to file under key `url`

Example response:

```json
{
    "url": [String]
}
```

## cut

Cuts a video with the given ID at the specified points.
Returns a new video ID that the cut video resides at.

### Data

POST request with the following attributes:

- `id` as key, ID of the video to get as value
- `start` as key, start time to cut as value
- `stop` as key, stop time to cut as value

### Returns

JSON data with the following attributes:

- ID of new video under key `id`

## delete

Deletes the video at the given ID.

### Data

POST requests with the following attributes:

- `id` as key, ID of the video to delete as value

### Returns

JSON data with the following attributes:

- Boolean determining if we deleted the vide under key `deleted`
