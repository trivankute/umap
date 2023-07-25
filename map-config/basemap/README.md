## Guide for map generation

**Prerequisite:** data must be ingested to POSTGIS db by osm2pgsql(or another tool) first

**To generate base map:**

1. Run map-extract.sql to generate required map feature
2. Add extracted data to Geoserver to generate basemap layers
3. Add style for each layer accordingly, each layer's style could be found at /styles folder

## Some references
1. [Youtube tutorial on map generation: ](https://www.youtube.com/watch?v=7Xk4FoDZAIo)
2. [Geoserver CSS documentation: ](https://docs.geoserver.org/stable/en/user/styling/workshop/css/css.html)
3. [Examples for CSS Styling from Geoserver: ](https://docs.geoserver.org/main/en/user/styling/css/cookbook/index.html)
4. [Map CSS styling tutorial for more complex example: ](https://www.youtube.com/watch?v=jwMNKPUL2iw)


