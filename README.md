Meio.Autocomplete.Geo - Copyright (c) 2010 Matti Schneider-Ghibaudo
========================================================================

Meio.Autocomplete.Geo - a MooTools plugin based on Meio.Autocomplete that autocompletes a field with Google Local Search results and allows you to retrieve latitude, longitude, city and other info from the user's selection.

How to use
----------

First of all, you need to include all dependencies:
*	[MooTools](http://mootools.net/download) of course, see exact dependencies in [Meio.Autocomplete](http://www.meiocodigo.com/projects/meio-autocomplete/)
*	[Meio.Autocomplete](http://www.meiocodigo.com/projects/meio-autocomplete/) itself
*	[Google Maps JS API](http://code.google.com/apis/maps/documentation/javascript/)
	**Note**: This code is intended for Google Maps API v3. Should be compatible with v2, but **has not been tested against v2**.
*	[Google Local Search](http://code.google.com/apis/ajaxsearch/local.html)
	…for which you'll also need a Google Maps API key (sorry, not my fault).

Then:
	var geocompleter = new Meio.Autocomplete.Geo('geoInput', {
		location: 'Paris, France' //though you could also pass a google.maps.LatLng instance
	});

That's it for geocompletion!

Now, if you want to know how to get latitude/longitude etc when the user selects an option, see the demo for a more complete example  :)

If you want to customize anything in the autocompleter behavior, see [Meio.Autocomplete](http://www.meiocodigo.com/projects/meio-autocomplete/).