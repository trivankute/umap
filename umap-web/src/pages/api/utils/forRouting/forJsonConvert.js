const { StaticPool } = require('node-worker-threads-pool');

export default async function forJsonConvert(routes) {
    // create pool
    const pool = new StaticPool({
        size: 10,
        task: './src/pages/api/utils/forRouting/jsonConvertWorker.js'
    });
    // create promises for both points and polygons
    let promises = [];
    for (let i = 0; i < routes.length; i++) {
        promises.push(pool.exec({route: routes[i]}));
    }
    // wait for all promises to resolve
    const results = await Promise.all(promises);
    // close pool
    pool.destroy(); 
    // return results
    return results;
} 