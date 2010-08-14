/**
*@author	Matti Schneider-Ghibaudo
*@license	MIT-style
*/

Meio.Autocomplete.Data.Geo = new Class({

	Extends: Meio.Autocomplete.Data,

	/**Available options, from http://code.google.com/apis/maps/documentation/javascript/reference.html#GeocoderRequest
	*	address		string			Address. Optional.
	*	bounds		LatLngBounds	LatLngBounds within which to search. Optional.
	*	language	string			Preferred language for results. Optional.
	*	location	LatLng			LatLng about which to search. Optional.
	*	region		string			Country code top-level domain within which to search. Optional.
	*/
	options: {
	},
	
	geocoder: new google.maps.Geocoder(),
	
	initialize: function init(geocoderReqOpts, cache) {
		this._cache = new Meio.Autocomplete.Cache();
		this.setOptions(geocoderReqOpts);
	},
	
	prepare: function(text){
		this.cachedKey = text;
		if (this._cache.has(this.cachedKey)){
			this.data = this._cache.get(this.cachedKey);
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
		var gs = google.maps.GeocoderStatus; //better compression
	    if (status == gs.OK || status == gs.ZERO_RESULTS) {
			this.cache(this.cachedKey, results);
			this.data = results;
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
		},
		/**Available options, from http://code.google.com/apis/maps/documentation/javascript/reference.html#GeocoderRequest
		*	address		string			Address. Optional.
		*	bounds		LatLngBounds	LatLngBounds within which to search. Optional.
		*	language	string			Preferred language for results. Optional.
		*	location	LatLng			LatLng about which to search. Optional.
		*	region		string			Country code top-level domain within which to search. Optional.
		*/
		geocoderRequest: {
		}
	},
	
	initData: function() {
		this.data = new Meio.Autocomplete.Data.Geo(this.options.geocoderRequest);
		this.data.addEvent('ready', this.dataReady.bind(this));
	}
});