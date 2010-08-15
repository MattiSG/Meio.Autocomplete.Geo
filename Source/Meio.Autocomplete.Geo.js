/**
*@author	Matti Schneider-Ghibaudo
*@license	MIT-style
*
*@dependencies
*	Meio.Autocomplete:		http://www.meiocodigo.com/projects/meio-autocomplete/
*	L__ MooTools, see exact dependencies in Meio.Autocomplete
*	Google Maps JS API:		http://code.google.com/apis/maps/documentation/javascript/reference.html#LatLng
*		Intended for v3. Not tested with v2, but should be compatible.
*	Google Local Search:	http://code.google.com/apis/ajaxsearch/local.html
*/

Meio.Autocomplete.Data.Geo = new Class({

	Extends: Meio.Autocomplete.Data,
	
	/**Google Local Search AJAX API
	*See http://www.google.com/uds/solutions/localsearch/reference.html
	*/
	localSearch: new GlocalSearch(),
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
		this.setLocation(geocoderReqOpts.location); //we can't use Options because they change the prototype
		this.localSearch.setSearchCompleteCallback(null, this.handleResults.bind(this));
	},
	
	setLocation: function setLocation(loc) {
		this.geocoderReqOpts.location = loc || '';
		this.cachePrefix = this.options.cachePrefix + this.geocoderReqOpts.location; //we can't refresh the cache on location change since it is global, and we can't have our own cache otherwise we won't honor Meio.Autocomplete.refreshCache()
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
		this.localSearch.setCenterPoint(this.geocoderReqOpts.location);
		this.localSearch.execute(query);		
	},
	
	cache: function cache(key, value) {
		this.parent(this.cachePrefix + key, value);
	},
	
	handleResults: function handleResults() {
		var results = this.localSearch.results;
		this.cache(this.cachedKey, results);
		this.data = results;
		this.fireEvent('ready');
	}
});
			
Meio.Autocomplete.Geo = new Class({
	Extends: Meio.Autocomplete,
		
	/**
	*@param	localSearchOptions	see Meio.Autocomplete.Data.Geo
	*/
	initialize: function(input, localSearchOptions, options, listInstance){
		this.localSearchOptions = localSearchOptions; //we can't use Options because they change the prototype
		options = $merge(options, {
			filter: {
				path: 'titleNoFormatting'
			}
		});
		this.parent(input, [], options, listInstance);
	},
	
	initData: function initData() {
		this.data = new Meio.Autocomplete.Data.Geo(this.localSearchOptions, this.cache);
		this.data.addEvent('ready', this.dataReady.bind(this));
	},
	
	setLocation: function setLocation(loc) {
		this.data.setLocation(loc);
	}
});