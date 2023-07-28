export default async function handler(prisma: any, city: string) {
    let result = await prisma.$queryRawUnsafe(`
        select city, st_asgeojson(ST_Boundary(st_transform(city_way,4326))), st_x(st_transform(st_centroid(city_way),4326)), st_y(st_transform(st_centroid(city_way),4326)) from cities_forsearch
        where unaccent(lower(city)) = unaccent(lower($1))
        `, city)
    await prisma.$disconnect()
    return result

}