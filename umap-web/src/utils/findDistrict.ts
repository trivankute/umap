export default async function handler(prisma: any, district: string) {
    let result = await prisma.$queryRawUnsafe(`
    WITH
    specific_district as (
    select district, district_geometry from districts_forsearch
    where levenshtein(unaccent(lower(district)), unaccent(lower($1))) = 0
    order by levenshtein(unaccent(lower(district)), unaccent(lower($1)))
    limit 1)
	
	select district, st_x(st_transform(st_centroid(district_geometry),4326)), 
    st_y(st_transform(st_centroid(district_geometry),4326)),st_asgeojson(ST_Boundary(st_transform(district_geometry,4326))) from specific_district
    `, district)
    await prisma.$disconnect()
    return result

}