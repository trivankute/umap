export default async function handler(prisma: any, ward: string, district: string|false, city: string|false) {
    let result
    if(!district && !city) 
    {
        result = await prisma.$queryRawUnsafe(`
        select ward, district, city, ward_way::text, st_asgeojson(ST_Boundary(st_transform(ward_way,4326))), st_x(st_transform(st_centroid(ward_way),4326)), st_y(st_transform(st_centroid(ward_way),4326)) from wards_forsearch
        where lower(unaccent(ward)) = lower(unaccent($1))
        limit 10
        `, ward)
        await prisma.$disconnect()
    }
    else {
        result = await prisma.$queryRawUnsafe(`
        select ward, district, city, ward_way::text, st_asgeojson(ST_Boundary(st_transform(ward_way,4326))), st_x(st_transform(st_centroid(ward_way),4326)), st_y(st_transform(st_centroid(ward_way),4326)) from wards_forsearch
        where lower(unaccent(ward)) = lower(unaccent($1))
        ${district !== false ? 'and lower(unaccent(district)) = lower(unaccent($2))' : ''}
        ${city !== false ? 'and lower(unaccent(city)) = lower(unaccent($3))' : ''}   
        `, ward, district, city)
        await prisma.$disconnect()
    }
    return result
}