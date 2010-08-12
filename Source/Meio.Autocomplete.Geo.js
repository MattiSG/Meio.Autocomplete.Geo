/**
*@author	Matti Schneider-Ghibaudo
*@license	MIT-style
*/

Meio.Autocomplete.Data.Geo = new Class({

	Extends: Meio.Autocomplete.Data,
	
	geocoder: new google.maps.Geocoder(),
	
	initialize: function init(geocoderOpts, cache) {
		this._cache = cache;
		this.geocoderOpts = geocoderOpts;
	},
	
	prepare: function(text){
		this.cachedKey = text;
		if (this._cache.has(this.cachedKey)){
			this.fireEvent('ready');
		} else {
			this.search(this.cachedKey);
		}
	},
	
	search: function(query) {
		this.geocoder.geocode(
			$merge(this.geocoderOpts, {address: query}),
			this.handleResults.bind(this)
		);
	},
	
	handleResults: function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
			this.cache(this.cachedKey, results);
			this.fireEvent('ready');
	    } else {
			throw('Geocoding failed (status: "' + status + '").');
	    }
	}
});


Meio.Autocomplete.Geo = new Class({
	Extends: Meio.Autocomplete,
	

	options: {
		filter: {
			path: 'formatted_address'
		}
	},
	
	initData: function() {
		this.data = new Meio.Autocomplete.Data.Geo({}, this.cache);
		this.data.addEvent('ready', this.dataReady.bind(this));
	}
});