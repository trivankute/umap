export default async function handler(prisma: any, street: string) {
    let result = await prisma.$queryRawUnsafe(`
	select name, st_asgeojson(st_transform(way,4326)), st_x(st_transform(st_centroid(way),4326)), st_y(st_transform(st_centroid(way),4326)) from planet_osm_line
    where boundary isnull and admin_level isnull and levenshtein(unaccent(lower(name)), unaccent(lower($1))) = 0
    `, street)
    await prisma.$disconnect()
    return result
}