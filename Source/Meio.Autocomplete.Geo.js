/**
*@author	Matti Schneider-Ghibaudo
*@license	MIT-style
*/

Meio.Autocomplete.Data.Geo = new Class({

	Extends: Meio.Autocomplete.Data,
	
	localSearch: new GlocalSearch(),
	
	/**
	*@param	geocoderReqOpts	a Hash that may include the following values:
	*	location	LatLng about which to search
	*/
	initialize: function init(geocoderReqOpts) {
		this._cache = new Meio.Autocomplete.Cache();
		this.geocoderReqOpts = geocoderReqOpts; //we can't use Options because they change the prototype
		this.localSearch.setSearchCompleteCallback(null, this.handleResults.bind(this));
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
		this.localSearch.setCenterPoint(this.geocoderReqOpts.location);
		this.localSearch.execute(query);		
	},
	
	handleResults: function() {
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
	
	initData: function() {
		this.data = new Meio.Autocomplete.Data.Geo(this.localSearchOptions);
		this.data.addEvent('ready', this.dataReady.bind(this));
	}
});