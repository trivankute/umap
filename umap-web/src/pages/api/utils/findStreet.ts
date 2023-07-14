export default async function handler(prisma: any, street: string) {
    let result = await prisma.$queryRawUnsafe(`
	select name, ward, district, st_asgeojson(st_transform(way,4326)), st_x(st_transform(st_centroid(way),4326)), st_y(st_transform(st_centroid(way),4326)) from streets_forsearch
    where levenshtein(unaccent(lower(name)), unaccent(lower($1))) = 0
    `, street)
    
    return result
}