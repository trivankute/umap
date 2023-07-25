export default async function handler(prisma: any, street: string, ward: string|false, district: string|false, city: string|false) {
    let newStreet = street
    // check if street already include 'Đường'
    if (typeof street === 'string' && (!street.startsWith('Đường') || street.startsWith('đường') || street.startsWith('ĐƯỜNG'))) {
        // add at first
        newStreet = 'Đường ' + street
    }
    else
    {
        // remove 'Đường' 
        newStreet = street.replace('Đường', '')
        newStreet = street.replace('đường', '')
        newStreet = street.replace('ĐƯỜNG', '')
    }
    let result
    if(ward === false && district === false && city === false)
    {
        result = await prisma.$queryRawUnsafe(`
        select street, ward, district, city, st_asgeojson(st_transform(street_way,4326)), st_x(st_transform(st_centroid(street_way),4326)), st_y(st_transform(st_centroid(street_way),4326)) from streets_forsearch
        where unaccent(lower(street)) = unaccent(lower($1)) or unaccent(lower(street)) = unaccent(lower($2))
        limit 10
        `, street, newStreet)
        await prisma.$disconnect()
    }
    else 
    {
        result = await prisma.$queryRawUnsafe(`
        select street, ward, district, city, st_asgeojson(st_transform(street_way,4326)), st_x(st_transform(st_centroid(street_way),4326)), st_y(st_transform(st_centroid(street_way),4326)) from streets_forsearch
        where (unaccent(lower(street)) = unaccent(lower($1)) or unaccent(lower(street)) = unaccent(lower($2)))
        ${ward !== false ? 'and lower(unaccent(ward)) = lower(unaccent($3))' : ''}
        ${district !== false ? 'and lower(unaccent(district)) = lower(unaccent($4))' : ''}
        ${city !== false ? 'and lower(unaccent(city)) = lower(unaccent($5))' : ''}
        `, street, newStreet, ward, district, city)
        await prisma.$disconnect()
    }
    return result
}