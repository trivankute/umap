const { StaticPool } = require('node-worker-threads-pool');

export default async function forDirection(routes, totalLength) {
    // create pool
    const pool = new StaticPool({
        size: 10,
        task: './src/pages/api/utils/forRouting/directionWorker.js'
    });
    // create promises for both points and polygons
    let promises = [];
    for (let i = 0; i < routes.length; i++) {
        promises.push(pool.exec({routes, route: routes[i], index:i, totalLength}));
    }
    // wait for all promises to resolve
    const results = await Promise.all(promises);
    // close pool
    pool.destroy(); 
    // return results
    return results;
} 