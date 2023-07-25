export default async function handler(prisma: any, district: string, city:string|false) {
    let result
    if(!city) 
    {
        result = await prisma.$queryRawUnsafe(`
        select district, city, st_asgeojson(ST_Boundary(st_transform(district_way,4326))), st_x(st_transform(st_centroid(district_way),4326)), st_y(st_transform(st_centroid(district_way),4326)) from districts_forsearch
        where unaccent(lower(district)) = unaccent(lower($1))
        limit 10
        `, district)
        await prisma.$disconnect()
    }
    else
    {
        result = await prisma.$queryRawUnsafe(`
        select district, city, st_asgeojson(ST_Boundary(st_transform(district_way,4326))), st_x(st_transform(st_centroid(district_way),4326)), st_y(st_transform(st_centroid(district_way),4326)) from districts_forsearch
        where unaccent(lower(district)) = unaccent(lower($1))
        and lower(unaccent(city)) = lower(unaccent($2))
        `, district, city)
        await prisma.$disconnect()
    }
    return result

}