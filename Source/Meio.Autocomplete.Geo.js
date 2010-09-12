/**
*@author	Matti Schneider-Ghibaudo
*@license	MIT-style
*
*@dependencies
*	Meio.Autocomplete:		http://www.meiocodigo.com/projects/meio-autocomplete/
*	L__ MooTools, see exact dependencies in Meio.Autocomplete
*	Google Maps JS API v3:	http://code.google.com/apis/maps/documentation/javascript/reference.html
*/

Meio.Autocomplete.Data.Geo = new Class({

	Extends: Meio.Autocomplete.Data,
	
	/**Google Local Search AJAX API
	*See http://www.google.com/uds/solutions/localsearch/reference.html
	*/
	geocoder: new google.maps.Geocoder(),
	geocoderReqOpts: {},
	/**Since the cache is global, we have to prefix keys to be sure that they won't be used somewhere else.
	*@private
	*/
	//TODO: use a sub-hash. Support needs to be implemented in Meio.Autocomplete first though.
	cachePrefix: '', //this is different from options.cachePrefix, and will be updated. Do not use, it's _private_!!
	
	options: {
		/**Prefix used in the global cache for cached data of this Data instance.
		*/
		cachePrefix: '_geo_',
	},
	
	/**
	*@param	geocoderReqOpts	a Hash that may include the following values:
	*	location	google.maps.LatLng or (lat, lng) array about which to search
	*/
	initialize: function init(geocoderReqOpts, cache) {
		this._cache = cache;
		this.setBounds(geocoderReqOpts.bounds); //we can't use Options because they change the prototype
	},
	
	setBounds: function setBounds(latLngBounds) {
		this.geocoderReqOpts.bounds = latLngBounds;
		this.cachePrefix = this.options.cachePrefix + latLngBounds; //we can't refresh the cache on location change since it is global, and we can't have our own cache otherwise we won't honor Meio.Autocomplete.refreshCache()
	},
	
	prepare: function prepare(query){
		this.cachedKey = this.cachePrefix + query;
		if (this._cache.has(this.cachedKey)) {
			this.data = this._cache.get(this.cachedKey);
			this.fireEvent('ready');
		} else {
			this.search(query);
		}
	},
	
	search: function search(query) {
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
	
	cache: function cache(key, value) {
		this.parent(this.cachePrefix + key, value);
	},
	
	handleResults: function handleResults(results, status) {
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
		
	/**
	*@param	geocoderReqOpts	see Meio.Autocomplete.Data.Geo
	*/
	initialize: function(input, geocoderReqOpts, options, listInstance){
		this.geocoderReqOpts = geocoderReqOpts; //we can't use Options because they change the prototype
		options = $merge(options, {
			filter: {
				path: 'formatted_address'
			}
		});
		this.parent(input, [], options, listInstance);
	},
	
	initData: function initData() {
		this.data = new Meio.Autocomplete.Data.Geo(this.geocoderReqOpts, this.cache);
		this.data.addEvent('ready', this.dataReady.bind(this));
	},
	
	setBounds: function setBounds(bounds) {
		this.data.setBounds(bounds);
	}
});

