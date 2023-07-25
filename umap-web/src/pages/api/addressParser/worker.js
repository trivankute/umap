const { parentPort } = require('worker_threads');
const importUrl = "./data/processed/"

const cities = require(`${importUrl}city.js`)
const districts = require(`${importUrl}district.js`)
const wards = require(`${importUrl}ward.js`)
const streets = require(`${importUrl}street.js`)
const names = require(`${importUrl}name.js`)
const housenumbers = require(`${importUrl}housenumber.js`)

const Fuse = require('fuse.js')
var levenshtein = require('fast-levenshtein');

const fuseForCities = new Fuse(cities, {
  includeScore: true,
  threshold: 0.5,
})
const fuseForDistricts = new Fuse(districts, {
  includeScore: true,
  threshold: 0.5
})
const fuseForWards = new Fuse(wards, {
  includeScore: true,
  threshold: 0.5
})
const fuseForStreets = new Fuse(streets, {
  includeScore: true,
  threshold: 0.3
})
const fuseForNames = new Fuse(names, {
  includeScore: true,
  threshold: 0.3
})
const fuseForHousenumbers = new Fuse(housenumbers, {
  includeScore: true,
  threshold: 0.3
})


async function findFirstKind(stringArrays, type) {
    let forResult = []
    let notPossible = 0 // large than 1 means not possible
    for (let i = 0; i < stringArrays.length; i++) {
        let res
        if (type === 'city')
            res = await fuseForCities.search(stringArrays[i], { limit: 5 })
        // else if(type==='province')
        //     res = await fuseForProvinces.search(stringArrays[i], {limit:5})
        else if (type === 'district')
            res = await fuseForDistricts.search(stringArrays[i], { limit: 5 })
        else if (type === 'ward')
            res = await fuseForWards.search(stringArrays[i], { limit: 5 })
        else if (type === 'street')
            res = await fuseForStreets.search(stringArrays[i], { limit: 5 })
        else if (type === 'housenumber')
            res = await fuseForHousenumbers.search(stringArrays[i], { limit: 5 })
        else if (type === 'housename')
            res = await fuseForNames.search(stringArrays[i], { limit: 5 })
        // console.log(res)
        if (res.length !== 0) {
            let resLowestScoreArray = []
            // res may have the same lowest score
            let lowestScore = res[0].score
            for (let j = 0; j < res.length; j++) {
                if (res[j].score === lowestScore) {
                    resLowestScoreArray.push(res[j])
                }
                else
                    break
            }

            if (resLowestScoreArray.length > 1) {
                // get the res with lowest score with levenshtein
                let resLowestScore = resLowestScoreArray[0]
                let distance = levenshtein.get(resLowestScore.item, stringArrays[i], { useCollator: true })
                for (let j = 1; j < resLowestScoreArray.length; j++) {
                    let tempDistance = levenshtein.get(resLowestScoreArray[j].item, stringArrays[i])
                    if (tempDistance < distance) {
                        resLowestScore = resLowestScoreArray[j]
                        distance = tempDistance
                    }
                }
                res = [resLowestScore]
            }
            else
                res = resLowestScoreArray
        }

        if (res.length > 0 && res[0].score < 0.6) {
            let a = new Fuse([stringArrays[i]], {
                includeScore: true,
                threshold: 0.5,
            })
            notPossible = 0
            let check = a.search(res[0].item)
            if (check.length > 0 && check[0].score < 0.6) {
                forResult.push({
                    score: res[0].score + check[0].score,
                    curString: stringArrays[i],
                    rightString: res[0].item,
                    distance: levenshtein.get(res[0].item, stringArrays[i], { useCollator: true }),
                    itemsLength: i + 1
                })
            }
            // console.log(stringArrays[i], res, check)
        }
        else
            notPossible++
        // console.log(stringArrays[i], res)
        if (notPossible > 2) {
            break
        }
    }
    // loop over forResult to find the smallest distance
    // console.log(forResult)
    if(forResult.length===0) return {type}
    let minDistance = 999
    for (let i = 0; i < forResult.length; i++) {
        if (forResult[i].distance < minDistance) {
            minDistance = forResult[i].distance
        }
    }
    // filter over forResult to find all items near the smallest distance
    forResult = forResult.filter(item => item.distance < minDistance + 2)

    // loop over forResult to find the longest itemsLength
    // console.log(forResult)
    if(forResult.length===0) return {type}
    let maxLength = 0
    for (let i = 0; i < forResult.length; i++) {
        if (forResult[i].itemsLength > maxLength) {
            maxLength = forResult[i].itemsLength
        }
    }
    // filter over forResult to find all items with the longest curString
    forResult = forResult.filter(item => item.itemsLength === maxLength)

    // loop over forResult to find the smallest score
    // console.log(forResult)
    if(forResult.length===0) return {type}
    let min = 999
    for (let i = 0; i < forResult.length; i++) {
        if (forResult[i].score < min) {
            min = forResult[i].score
            minIndex = i
        }
    }

    // filter over forResult to find all items with the smallest score
    let result = forResult.filter(item => item.score === min)

    // more than one result then get the last one
    if (result.length > 1) {
        result = [result[result.length - 1]]
    }

    return { ...result[0], type }
}

parentPort.on('message', async (data) => {
    let { stringArrays, type } = data;
    let a = await findFirstKind(stringArrays, type);
    parentPort.postMessage(a);
})