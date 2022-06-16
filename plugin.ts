const uploader = new ui.Upload("*.csv");
uploader.onUpload.subscribe(file => {
    file.toString().then(content => {
        const lines = content.split("\n");

        let latitudeColumnIndex = 0;
        let longitudeColumnIndex = 1;

        // check if the first line contains headers
        if (isNaN(+lines[0].split(",")[0])) {
            // get and drop the header from the lines array
            const headers = lines.shift().toLowerCase().split(",");

            // try to set lat/long order automatically by parsing the headers
            latitudeColumnIndex = headers.findIndex(header => header.includes("lat"));
            longitudeColumnIndex = headers.findIndex(header => header.includes("lon") || header.includes("lng"));

            if (latitudeColumnIndex == -1 || longitudeColumnIndex == -1) {
                latitudeColumnIndex = 0;
                longitudeColumnIndex = 1;
            }
        }

        const markers: map.Marker[] = [];

        // add all values to the markers array
        for (let line of lines) {
            // skip empty lines
            if (line.trim()) {
                const fields = line.split(",");

                // create marker
                markers.push(new map.Marker(
                    new GlobalPosition(
                        +fields[latitudeColumnIndex], 
                        +fields[longitudeColumnIndex]
                    )
                ));
            }
        }

        // focus the markers
        map.focus(markers);
    });
});