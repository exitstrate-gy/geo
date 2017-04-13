$(window).ready(function() {
	//Get the year
	var current_year = new Date().getFullYear();

	//Create map
	var sitesMap = L.map('mapid').setView([	23, 10], 1.5);

	// Define icon colors: see https://github.com/pointhi/leaflet-color-markers
	var activeIcon = new L.Icon({
		iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		});
	var decommissionedIcon = new L.Icon({
		iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		});				

	// Add basemap
	L.tileLayer(
	'https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoidm5heWxvbiIsImEiOiJjajBzczU1amwwMmcxMnFscm1veG80ZzV3In0.E2I5QUe3l92M1pmGKie8_A', {
	    tileSize: 512,
	    zoomOffset: -1,
		   	attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(sitesMap);

	// Define the marker layer before adding markers
	var spaceportsLayer = null;

	function loadMarkers(){
		// If there is already a layer of markers, remove it
		if(spaceportsLayer){
			sitesMap.removeLayer(spaceportsLayer);
		}
		// Add features from GeoJSON file
		spaceportsLayer = L.geoJson(allSatports, {
			// Define marker color
    	    style: function (feature) {
	    	       return { color: feature.properties.color };
    	    },
			// Create popup
    	    onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.name + '<br/>Operated 	by ' + feature.properties.owner + '<br/>' + feature.	properties.caption);
			},
			// Use status-dependent markers
			pointToLayer: function(feature, latlng) {
				var icon = null;
				var start_year = feature.properties.commission_year
				var end_year = feature.properties.decommission_year
				
				// Don't add a marker if the spaceport hasn’t been built
				if(start_year > current_year){ return(null); }
				// Check if the spaceport is active. If it is, give it a green marker
				else if(end_year === null || current_year < end_year){ 
					icon = 	activeIcon 
				// If it's not, give it a gray marker
				}else{ icon = decommissionedIcon; }

				return(new L.marker(latlng, {icon: icon}));
			}
		});

		sitesMap.addLayer(spaceportsLayer);
	}
	// Create a slider that steps
	var stepSlider = document.getElementById('slider-step');

	noUiSlider.create(stepSlider, {
		start: [ 2017 ],
		step: 1,
		range: {
		  'min': 1957,
		  'max': 2017
		},
		pips: {
			mode: 'count',
			values: 7,
			density: (10/6)
		}
	});
	// When the slider moves…
	stepSlider.noUiSlider.on('update', function(values){
		current_year = values[0]-0;
		console.log("current_year: ", current_year);
		console.log("updated: ", values);
		// …run the loadMarkers function again ^
		loadMarkers();
	});
});
