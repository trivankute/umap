export default async function handler(prisma:any, ward:string, district:string) {
    let result = await prisma.$queryRawUnsafe(`
    WITH
    specific_district as (
    select district, district_geometry from districts_forsearch
    order by levenshtein(unaccent(lower(district)), unaccent(lower($1)))
    limit 1),
    specific_ward as (select * from wards_forsearch, specific_district
    where st_contains(specific_district.district_geometry, ward_geometry) and levenshtein(unaccent(lower(ward)), unaccent(lower($2))) = 0
    order by levenshtein(unaccent(lower(ward)), unaccent(lower($2)))
    limit 1)
	
	select ward, st_x(st_transform(st_centroid(ward_geometry),4326)), 
    st_y(st_transform(st_centroid(ward_geometry),4326)),st_asgeojson(ST_Boundary(st_transform(ward_geometry,4326))) from specific_ward
    `, district, ward)
    return result
    
}