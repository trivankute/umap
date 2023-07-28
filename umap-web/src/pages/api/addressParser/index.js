const { StaticPool } = require('node-worker-threads-pool');

export default async function addressParser(fullAddress) {
    const pool = new StaticPool({
        size: 3,
        task: './src/pages/api/addressParser/worker.js'
    });
    let result = {
        housenumber: false,
        housename: false,
        street: false,
        ward: false,
        district: false,
        city: false,
        // province: false
    }
    if (fullAddress === '') return {
        housenumber: "",
        housename: "",
        street: "",
        ward: "",
        district: "",
        city: "",
        // province: ""
    }
    // delete all ','; '.';
    fullAddress = fullAddress.replace(/,/g, '')
    let stop = false
    while (!stop) {
        // split fullAddress into array of tokens
        let testTokens = fullAddress.split(' ')
        let stringArrays = []
        for (let i = 1; i <= testTokens.length; i++) {
            stringArrays.push(testTokens.slice(0, i).join(' '))
        }
        let order = ['city', 'district', 'ward', 'street', 'housenumber', 'housename'];
        let promises = [];
        for (let i = 0; i < order.length; i++) {
            if (result.housename === false && order[i] === 'housename') {
                promises.push(pool.exec({ stringArrays, type: order[i] }));
            }
            if (result.housenumber === false && order[i] === 'housenumber') {
                promises.push(pool.exec({ stringArrays, type: order[i] }));
            }
            if (result.street === false && order[i] === 'street') {
                promises.push(pool.exec({ stringArrays, type: order[i] }));
            }
            if (result.ward === false && order[i] === 'ward') {
                promises.push(pool.exec({ stringArrays, type: order[i] }));
            }
            if (result.district === false && order[i] === 'district') {
                promises.push(pool.exec({ stringArrays, type: order[i] }));
            }
            if (result.city === false && order[i] === 'city') {
                promises.push(pool.exec({ stringArrays, type: order[i] }));
            }
        }
        let probsArray = await Promise.all(promises)

        // filter lowest distance
        let minDistance = 999
        for (let i = 0; i < probsArray.length; i++) {
            if (probsArray[i].distance < minDistance) {
                minDistance = probsArray[i].distance
            }
        }
        probsArray = probsArray.filter(item => item.distance < minDistance + 2)

        // filter longest itemsLength
        let maxLength = 0
        for (let i = 0; i < probsArray.length; i++) {
            if (probsArray[i].itemsLength > maxLength) {
                maxLength = probsArray[i].itemsLength
            }
        }
        probsArray = probsArray.filter(item => item.itemsLength === maxLength)

        // filter smallest score
        let min = 999
        let minIndex = 0
        for (let i = 0; i < probsArray.length; i++) {
            if (probsArray[i].score < min) {
                min = probsArray[i].score
                minIndex = i
            }
        }

        if (probsArray.length > 0) {
            let tempType = probsArray[minIndex].type
            let tempRightString = probsArray[minIndex].rightString
            let tempString = probsArray[minIndex].curString
            result[tempType] = tempRightString
            fullAddress = fullAddress.replace(tempString, '')
            fullAddress = fullAddress.trim()
            if (tempType === 'street') {
                if (result['housename'] === false)
                    result['housename'] = true
                else if (result['housenumber'] === false)
                    result['housenumber'] = true
            }
            else if (tempType === 'ward') {
                if (result['housename'] === false)
                    result['housename'] = true
                else if (result['housenumber'] === false)
                    result['housenumber'] = true
                else if (result['street'] === false)
                    result['street'] = true
            }
            else if (tempType === 'district') {
                if (result['housename'] === false)
                    result['housename'] = true
                else if (result['housenumber'] === false)
                    result['housenumber'] = true
                else if (result['street'] === false)
                    result['street'] = true
                else if (result['ward'] === false)
                    result['ward'] = true
            }
            else if (tempType === 'city') {
                if (result['housename'] === false)
                    result['housename'] = true
                else if (result['housenumber'] === false)
                    result['housenumber'] = true
                else if (result['street'] === false)
                    result['street'] = true
                else if (result['ward'] === false)
                    result['ward'] = true
                else if (result['district'] === false)
                    result['district'] = true
            }
            // if (tempType === 'province') {
            //     if (result['housename'] === false)
            //         result['housename'] = true
            //     if (result['housenumber'] === false)
            //         result['housenumber'] = true
            //     if (result['street'] === false)
            //         result['street'] = true
            //     if (result['ward'] === false)
            //         result['ward'] = true
            //     if (result['district'] === false)
            //         result['district'] = true
            //     if (result['city'] === false)
            //         result['city'] = true
            // }
        }
        else {
            stop = true
        }
        // console.log("loop")
    }
    // console.log("done")
    await pool.destroy()
    return result
}



// console.log(fuseForDistricts.search('quận 1'))