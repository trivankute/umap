const importUrl = "./data/processed/"

const districts = require(`${importUrl}district.json`)
const wards = require(`${importUrl}ward.json`)
const streets = require(`${importUrl}street.json`)
const names = require(`${importUrl}name.json`)
const housenumbers = require(`${importUrl}housenumber.json`)

const Fuse = require('fuse.js')

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

async function usingFuses(string, signal) {
    let res = []
    // must be in order like this so that when regconize equal 0 will correct the type
    if (signal.housename === false) {
        res.push({ type: 'housename', data: await fuseForNames.search(string, { limit: 1 }) })
    }

    if (signal.housenumber === false) {
        res.push({ type: 'housenumber', data: await fuseForHousenumbers.search(string, { limit: 1 }) })
    }

    if (signal.street === false) {
        res.push({ type: 'street', data: await fuseForStreets.search(string, { limit: 1 }) })
    }

    if (signal.district === false) {
        res.push({ type: 'district', data: await fuseForDistricts.search(string, { limit: 1 }) })
    }

    if (signal.ward === false) {
        res.push({ type: 'ward', data: await fuseForWards.search(string, { limit: 1 }) })
    }

    return res
}

export default async function addressParser(fullAddress) {
    let result = {
        housenumber: false,
        housename: false,
        street: false,
        ward: false,
        district: false,
        city: 'Thành phố Hồ Chí Minh'
    }
    if (fullAddress === '') return {
        housenumber: "",
        housename: "",
        street: "",
        ward: "",
        district: "",
        city: ""
    }
    // delete all ','; '.';
    fullAddress = fullAddress.replace(/,/g, '')
    // split fullAddress into array of tokens
    let addressTokens = fullAddress.split(' ')
    let curString = ""
    let indexStart = 0
    let curType = false
    let onlyBackwardOneTime = false
    /////////////////////////////////////// old version nothing here
    let typeChange = false
    let rightString = ''
    for (let i = 0; i < addressTokens.length; i++) {
        curString = addressTokens.slice(indexStart, i + 1).join(' ')
        // console.log(curString)
        let res = await usingFuses(curString, result)
        let curScore = 1
        // count number of not [] in res
        let countCompatible = 0
        for (let j = 0; j < res.length; j++) {
            if (res[j].data.length > 0&&res[j].data[0].score < 0.2) {
                countCompatible++
            }
        }
        // console.log(countCompatible)
        if (countCompatible > 0) {
            //////////////////////////////////////// old version nothing here
            // find the smallest score in res
            let tempType = curType
            let tempScore = curScore
            let tempString = rightString
            for (let j = 0; j < res.length; j++) {
                //////////////////////////////////////////////// old version
                // if (res[j].data.length > 0 && res[j].data[0].score < curScore) {
                if (res[j].data.length > 0 && res[j].data[0].score < tempScore) {
                    tempType = res[j].type
                    tempScore = res[j].data[0].score
                    tempString = res[j].data[0].item

                    ///////////////////////////////////// old version
                    // curType = res[j].type
                    // curScore = res[j].data[0].score
                    // rightString = res[j].data[0].item
                }
            }
            if (curType !== false && tempType !== curType) {
                typeChange = true
            }
            else {
                curType = tempType
                curScore = tempScore
                rightString = tempString
            }
            // console.log(curString, tempType, tempScore, tempString, typeChange)
        }
        //////////////////////////////////////old version
        // else 
        if (countCompatible === 0 || typeChange === true) {
            // cut the last word of curString
            // curString = addressTokens.slice(indexStart, i).join(' ')
            // result[curType] = curString

            // for autocomplete
            if(curType!==false)
                result[curType] = rightString
            if (curType === 'street') {
                if (result['housename'] === false)
                    result['housename'] = true
                if (result['housenumber'] === false)
                    result['housenumber'] = true
            }
            if (curType === 'ward') {
                if (result['housename'] === false)
                    result['housename'] = true
                if (result['housenumber'] === false)
                    result['housenumber'] = true
                if (result['street'] === false)
                    result['street'] = true
            }
            if (curType === 'district') {
                if (result['housename'] === false)
                    result['housename'] = true
                if (result['housenumber'] === false)
                    result['housenumber'] = true
                if (result['street'] === false)
                    result['street'] = true
                if (result['ward'] === false)
                    result['ward'] = true
            }
            indexStart = i
            if (countCompatible === 0 && onlyBackwardOneTime === false) {
                i--
                onlyBackwardOneTime = true
            }
            else if (countCompatible === 0 && onlyBackwardOneTime === true) {
                onlyBackwardOneTime = false
            }
            curType = false
            // /////////////////////////////// old version nothing
            typeChange = false
            rightString = ''
            continue
        }

    }

    if (curType !== false) {
        result[curType] = rightString
        ////////////////////////////////////////// test for rules check
        if (curType === 'street') {
            if (result['housename'] === false)
                result['housename'] = true
            if (result['housenumber'] === false)
                result['housenumber'] = true
        }
        if (curType === 'ward') {
            if (result['housename'] === false)
                result['housename'] = true
            if (result['housenumber'] === false)
                result['housenumber'] = true
            if (result['street'] === false)
                result['street'] = true
        }
        if (curType === 'district') {
            if (result['housename'] === false)
                result['housename'] = true
            if (result['housenumber'] === false)
                result['housenumber'] = true
            if (result['street'] === false)
                result['street'] = true
            if (result['ward'] === false)
                result['ward'] = true
        }
    }
    // console.log(curType, rightString)
    return result
}