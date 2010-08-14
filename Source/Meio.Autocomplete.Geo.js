/**
*@author	Matti Schneider-Ghibaudo
*@license	MIT-style
*/

Meio.Autocomplete.Data.Geo = new Class({

	Extends: Meio.Autocomplete.Data,
	
	geocoder: new google.maps.Geocoder(),
	
	/**Available options, from http://code.google.com/apis/maps/documentation/javascript/reference.html#GeocoderRequest
	*	address		string			Address. Optional.
	*	bounds		LatLngBounds	LatLngBounds within which to search. Optional.
	*	language	string			Preferred language for results. Optional.
	*	location	LatLng			LatLng about which to search. Optional.
	*	region		string			Country code top-level domain within which to search. Optional.
	*/
	initialize: function init(geocoderReqOpts) {
		this._cache = new Meio.Autocomplete.Cache();
		this.geocoderReqOpts = geocoderReqOpts; //we can't use Options because they change the prototype
	},
	
	prepare: function(text){
		this.cachedKey = text;
		if (this._cache.has(this.cachedKey)) {
			this.data = this._cache.get(this.cachedKey);
			this.fireEvent('ready');
		} else {
			this.search(this.cachedKey);
		}
	},
	
	search: function(query) {
		var ro = this.geocoderReqOpts;
		this.geocoder.geocode(
			{ //we can't use $merge because it changes the subobjects' prototypes
				address:	query,
				bounds:		ro.bounds,
				language:	ro.language,
				location:	ro.location,
				region:		ro.region
			},
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
		
	/**Available options, from http://code.google.com/apis/maps/documentation/javascript/reference.html#GeocoderRequest
	*	bounds		LatLngBounds	LatLngBounds within which to search.
	*	language	string			Preferred language for results.
	*	location	LatLng			LatLng about which to search.
	*	region		string			Country code top-level domain within which to search.
	*/
	initialize: function(input, geocoderRequestOptions, options, listInstance){
		this.geocoderRequestOptions = geocoderRequestOptions; //we can't use Options because they change the prototype
		options = $merge(options, {
			filter: {
				path: 'formatted_address'
			}
		});
		this.parent(input, [], options, listInstance);
	},
	
	initData: function() {
		this.data = new Meio.Autocomplete.Data.Geo(this.geocoderRequestOptions);
		this.data.addEvent('ready', this.dataReady.bind(this));
	}
});