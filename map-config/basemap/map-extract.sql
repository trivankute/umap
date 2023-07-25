DROP TABLE IF EXISTS provinces;	
CREATE TABLE provinces AS	
SELECT osm_id, 
	name,  
	upper(name) AS uppername,
	st_transform(st_multi(way), 4326) as way
FROM planet_osm_polygon
WHERE admin_level = '4'::text AND boundary = 'administrative'::text
;

DROP TABLE IF EXISTS districts;	
CREATE TABLE districts AS	
SELECT osm_id, 
	name,  
	upper(name) AS uppername,
	st_transform(st_multi(way), 4326) as way
FROM planet_osm_polygon
WHERE admin_level = '6'::text AND boundary = 'administrative'::text
;
	
DROP TABLE IF EXISTS wards;	
CREATE TABLE wards AS	
SELECT osm_id, 
	name,  
	upper(name) AS uppername,
	st_transform(st_multi(way), 4326) as way
FROM planet_osm_polygon
WHERE admin_level = '8'::text AND boundary = 'administrative'::text
;

	
DROP TABLE IF EXISTS amenity;	
CREATE TABLE amenity AS	
SELECT osm_id, 
	name,  
	upper(name) AS uppername,
	st_transform(st_multi(way), 4326) as way
FROM planet_osm_polygon
WHERE 
	amenity IS NOT NULL 
	AND (amenity = ANY (ARRAY['college'::text, 'community_centre'::text, 'courthouse'::text, 'doctors'::text, 'embassy'::text, 'grave_yard'::text, 'hospital'::text, 'library'::text, 'marketplace'::text, 'prison'::text, 'public_building'::text, 'school'::text, 'simming_pool'::text, 'theatre'::text, 'townhall'::text, 'university'::text]))
;
	
	
DROP TABLE IF EXISTS buildings;	
CREATE TABLE buildings AS	
SELECT osm_id, 
	name,  
	upper(name) AS uppername,
	"addr:housename" as housename,
	"addr:housenumber" as housenumber,
	st_transform(st_multi(way), 4326) as way
FROM planet_osm_polygon
WHERE 
	building IS NOT NULL 
	AND St_Area(way) < 100000::double precision
;


DROP TABLE IF EXISTS forestpark;	
CREATE TABLE forestpark AS	
SELECT osm_id, 
	name,  
	st_transform(st_multi(way), 4326) as way
FROM planet_osm_polygon
WHERE 
	planet_osm_polygon.natural IS NOT NULL
	AND (planet_osm_polygon.natural = 'wood'::text) OR (landuse = ANY (ARRAY['greenery'::text, 'green'::text, 'garden'::text, 'Reserve_forest'::text, 'forest'::text, 'orchard'::text, 'park'::text, 'plant_nursery'::text, 'grass'::text, 'greenfield'::text, 'meadow'::text, 'recreation_ground'::text, 'village_green'::text, 'vineyard'::text])) OR (planet_osm_polygon.leisure = ANY (ARRAY['nature_reserve'::text, 'park'::text, 'dog_park'::text, 'garden'::text, 'golf_course'::text, 'horse_riding'::text, 'recreation_ground'::text, 'stadium'::text]))
;


DROP TABLE IF EXISTS lakes;	
CREATE TABLE lakes AS	
SELECT osm_id, 
	name,  
	way_area,
	st_transform(st_multi(way), 4326) as way
FROM planet_osm_polygon
WHERE 
	"natural" = 'water'::text 
	AND (water IS NULL OR water IS NOT NULL AND water <> 'river'::text)
;

DROP TABLE IF EXISTS waterway;	
CREATE TABLE waterway AS	
SELECT osm_id, 
	name,  
	st_transform(st_multi(way), 4326) as way
FROM planet_osm_line
WHERE 
	waterway = ANY (ARRAY['drain'::text, 'canal'::text, 'waterfall'::text, 'river'::text, 'stream'::text, 'yes'::text])
;

DROP TABLE IF EXISTS water;	
CREATE TABLE water AS	
SELECT osm_id, 
	name,  
	st_transform(st_multi(way), 4326) as way
FROM planet_osm_polygon
WHERE 
	"natural" = 'water'::text OR water IS NOT NULL OR waterway ~~ '%riverbank%'::text
;

DROP TABLE IF EXISTS minor_roads;	
CREATE TABLE minor_roads AS	
SELECT osm_id, 
	name,  
	st_transform(st_multi(way), 4326) as way
FROM planet_osm_line
WHERE 
	highway IS NOT NULL 
	AND (highway <> ALL (ARRAY['motorway'::text, 'motorway_link'::text, 'trunk'::text, 'primary'::text, 'trunk_link'::text, 'primary_link'::text, 'secondary'::text, 'secondary_link'::text, 'road'::text, 'tertiary'::text, 'tertiary_link'::text, 'steps'::text, 'footway'::text, 'path'::text, 'pedestrian'::text, 'walkway'::text, 'service'::text, 'track'::text])) 
	AND railway IS NULL OR railway = 'no'::text
;


DROP TABLE IF EXISTS motorway;	
CREATE TABLE motorway AS	
SELECT osm_id, 
	name,  
	st_transform(st_multi(way), 4326) as way
FROM planet_osm_line
WHERE 
	highway = 'motorway'::text
;


DROP TABLE IF EXISTS pedestrian;	
CREATE TABLE pedestrian AS	
SELECT osm_id, 
	name,  
	st_transform(st_multi(way), 4326) as way
FROM planet_osm_line
WHERE 
	highway = ANY (ARRAY['steps'::text, 'footway'::text, 'path'::text, 'pedestrian'::text, 'walkway'::text, 'service'::text, 'track'::text])
;

DROP TABLE IF EXISTS rails;	
CREATE TABLE rails AS	
SELECT osm_id, 
	name,  
	st_transform(st_multi(way), 4326) as way
FROM planet_osm_line
WHERE 
	railway IS NOT NULL AND (railway = ANY (ARRAY['light rail'::text, 'rail'::text, 'rail;construction'::text, 'tram'::text, 'yes'::text, 'traverser'::text])) OR railway ~~ '%rail%'::text		
;


DROP TABLE IF EXISTS roads;	
CREATE TABLE roads AS	
SELECT osm_id, 
	name,  
	st_transform(st_multi(way), 4326) as way
FROM planet_osm_line
WHERE 
	highway = ANY (ARRAY['trunk_link'::text, 'primary_link'::text, 'secondary'::text, 'secondary_link'::text, 'road'::text, 'tertiary'::text, 'tertiary_link'::text])		
;

DROP TABLE IF EXISTS trunk_primary;	
CREATE TABLE trunk_primary AS	
SELECT osm_id, 
	name,  
	st_transform(st_multi(way), 4326) as way
FROM planet_osm_line
WHERE 
	highway = ANY (ARRAY['motorway_link'::text, 'primary'::text]) 
;

DROP TABLE IF EXISTS mark;	
CREATE TABLE mark AS	
SELECT osm_id, 
	name,
	amenity,
	shop,
	tourism, 
	leisure,
	highway,
	st_transform(st_multi(way), 4326) as way
FROM planet_osm_point
WHERE 
	amenity is not null OR shop is not null OR tourism is not null OR leisure is not null OR highway is not null
;


