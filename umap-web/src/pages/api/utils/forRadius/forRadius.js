const { StaticPool } = require('node-worker-threads-pool');

export default async function forRadius(points, polygons) {
    // create pool
    const pool = new StaticPool({
        size: 10,
        task: './src/pages/api/utils/forRadius/worker.js'
    });
    // create promises for both points and polygons
    let promises = [];
    for (let i = 0; i < points.length; i++) {
        promises.push(pool.exec({ lng: points[i].lng, lat: points[i].lat }));
    }
    for (let i = 0; i < polygons.length; i++) {
        promises.push(pool.exec({ lng: polygons[i].lng, lat: polygons[i].lat }));
    }
    // wait for all promises to resolve
    const results = await Promise.all(promises);
    // close pool
    pool.destroy();
    // return results
    return results;
} 