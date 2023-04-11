console.log("-----start of video-editing.js-------")

async function makeRequest(url, data) {
    // Makes a generic request to the specified URL

    // Make request to backend:

    const promise = fetch(url, {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            "Accept": "application/json",
        },
        body: data,
    });

    var final_data = await promise.then(res => res.json());

    return final_data;
}

async function cutVideo(id, timestamps){
    // Given a dictonary containing a timestamp list, cut the video in according to the timestamps.
    
    let timestampJson = JSON.stringify(timestamps);
    let timestampList = timestamps["timestamps"];

    console.log(timestampList);

    var data = new FormData();
    data.append('id', id);
    data.append('cuts', timestampJson);
    
    var new_id = await makeRequest("/api/cuts/", data);
    
    download_url = await getVideo(new_id["id"]);
    console.log("New ID");
    console.log(new_id);

    console.log("New download url");
    console.log(download_url);
    console.log(download_url["url"]);
}

async function getVideo(id){
    var data = new FormData();
    data.append('id', id);

    var retrieved_id = await makeRequest("/api/get/", data);
    return retrieved_id;
}

