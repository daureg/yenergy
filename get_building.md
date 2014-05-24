From [Overpass](http://overpass-turbo.eu/)

Choose a suitable view and run

```
way({{bbox}})["building"];
(._;>;);
out body;
```

Export as GeoJSON, import it in [mapshaper](http://mapshaper.org/), where you
can simplify it and reexport it as GeoJSON.

Then filter lines based on building name.

