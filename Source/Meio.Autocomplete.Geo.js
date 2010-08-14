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
	
	localSearch: new GlocalSearch(),
	geocoderReqOpts: {},
	
	/**
	*@param	geocoderReqOpts	a Hash that may include the following values:
	*	location	google.maps.LatLng or (lat, lng) array about which to search
	*/
	initialize: function init(geocoderReqOpts) {
		this._cache = new Meio.Autocomplete.Cache();
		this.setLocation(geocoderReqOpts.location || ''); //we can't use Options because they change the prototype
		this.localSearch.setSearchCompleteCallback(null, this.handleResults.bind(this));
	},
	
	setLocation: function setLocation(loc) {
		this.geocoderReqOpts.location = loc || '';
	},
	
	prepare: function prepare(text){
		this.cachedKey = text;
		if (this._cache.has(this.cachedKey)) {
			this.data = this._cache.get(this.cachedKey);
			this.fireEvent('ready');
		} else {
			this.search(this.cachedKey);
		}
	},
	
	search: function search(query) {
		this.localSearch.setCenterPoint(this.geocoderReqOpts.location);
		this.localSearch.execute(query);		
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
		this.data = new Meio.Autocomplete.Data.Geo(this.localSearchOptions);
		this.data.addEvent('ready', this.dataReady.bind(this));
	},
	
	setLocation: function setLocation(loc) {
		this.data.setLocation(loc);
	}
});