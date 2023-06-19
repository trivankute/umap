import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import updatedDates from '../../data/updatedDates';
import fs from 'fs'
import { urlForTrackingHCMOsmDate } from '../../data/updateRelatedUrl';
import path from 'path';
import { updateDatesUrl } from '@/pages/fileUrlsConfig';

export function getParentDirectory() {
    let parentDirectory = path.resolve(__dirname)
    // it becomes something like this D:\ThucTap\umap\umap-web\.next\server\pages\api
    // substring until .next disappears
    while(parentDirectory.includes(".next")) {
        parentDirectory = parentDirectory.substring(0, parentDirectory.lastIndexOf('\\'))
    }
    return parentDirectory
}

export default async function getDates(req: NextApiRequest, res: NextApiResponse) {
    const response = await axios.get(urlForTrackingHCMOsmDate);
    const data = await response.data
    
    // find "abbr" element in this response.data string
    const abbrIndex = data.indexOf("abbr");
    // get the title of abbr element
    const title = data.substring(abbrIndex + 12, data.indexOf(">", abbrIndex)-1);
    // title now is Date String, turn it to date
    const date = new Date(title);
    // turn dates in updatedDates to date
    let lastOsmMapUpdatedDate = new Date(updatedDates.lastOsmMapUpdatedDate)
    let lastAppMapUpdatedDate = new Date(updatedDates.lastAppMapUpdatedDate)

    // instantly update the lastOsmMapUpdatedDate to file updatedDates.ts
    let parentDirectory = getParentDirectory()
    if (date > lastOsmMapUpdatedDate) {
        // write new date to ../../data/updatedDates.ts
        fs.writeFileSync(parentDirectory + updateDatesUrl, `const updatedDates = {
    lastAppMapUpdatedDate: "${lastAppMapUpdatedDate.toISOString()}",
    lastOsmMapUpdatedDate: "${date.toISOString()}"
        }
        
export default updatedDates;`, 
        // @ts-ignore
        (err) => {
            if (err) throw err;
            console.log('Data written to file');
            }
        );
    }

    // calculate the difference in days and hours
    // @ts-ignore
    const diff = date - lastAppMapUpdatedDate;

    // convert to days
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    // convert to hours after minus days
    const hours = Math.floor((diff - days * (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const diffCalculated = (days.toString()+((days===0||days===1)?" day and ":" days and ") + hours.toString() + ((hours===0||hours===1)?" hour":" hours"))

    // return res
    res.status(200).json({
        lastAppMapUpdatedDate: lastAppMapUpdatedDate,
        lastOsmMapUpdatedDate: date,
        diffCalculated: diffCalculated
    })
}