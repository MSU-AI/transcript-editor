// This function generates the timeline
function generateTimeline(src) {

    $( "#defaultPlayer" ).mediaPlayer( {
        autoplay: false,
        src: src,
        controlBar: {
            sticky: true
        },
        plugins: {
            dataServices: [
                '../timeline/samples-data/examples/json/amalia01-events.json',
                '../timeline/samples-data/examples/json/amalia01-kf.json',
                '../timeline/samples-data/examples/json/amalia01-ball.json'
            ],
            list: [
                {
                    'className': 'fr.ina.amalia.player.plugins.TimelinePlugin',
                    'container': '#amalia-timeline',
                    'parameters': {
                        listOfLines: [
                            {
                                title: 'Events',
                                type: 'cuepoint',
                                metadataId: 'events-amalia01',
                                color: '#3CF',
                                pointNav: true
                            },
                            {
                                title: 'Ball moving up',
                                type: 'segment',
                                metadataId: 'ball-amalia01',
                                color: '#F00'
                            },
                            {
                                title: 'Keyframes every 2s',
                                type: 'image',
                                metadataId: 'kf-amalia01',
                                pointNav: true
                            }
                        ]
                    }
                }
            ]
        }
    });
}

