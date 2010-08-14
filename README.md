Meio.Autocomplete.Geo - Copyright (c) 2010 Matti Schneider-Ghibaudo
========================================================================

Meio.Autocomplete.Geo - a MooTools plugin based on Meio.Autocomplete that autocompletes a field with Google Local Search results.

How to use
----------

First of all, you need to include all dependencies (see demo). You'll also need a Google Maps API key (sorry, not my fault).

Then:
	#JS
	var geocompleter = new Meio.Autocomplete.Geo('geoInput', {
		location: 'Paris, France' //though you could also pass a google.maps.LatLng instance
	});

That's it for autocompletion!
Now, if you want to know how to get latitude/longitude etc when the user selects an option, see the demo for a more complete example  :)

If you want to customize anything in the autocompleter behavior, see [Meio.Autocomplete](http://www.meiocodigo.com/projects/meio-autocomplete/).