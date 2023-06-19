import { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process'
import { urlForAxiosHCMOsm, urlForTrackingHCMOsmDate } from '../../data/updateRelatedUrl';
import axios from 'axios';
import fs from 'fs'
import updatedDates from '../../data/updatedDates';
import { getParentDirectory } from '../getDates';
import { defaultStyleUrl, mapDataUrl, osm2pgsqlUrl, updateDatesUrl } from '@/pages/fileUrlsConfig';

async function fetchDataFromTPHCMOsm(parentDirectory: string) {
    const response = await axios.get(urlForAxiosHCMOsm);
    const data = await response.data
    fs.writeFile(parentDirectory + mapDataUrl, data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    }
    );
}

async function updateToPostgis(parentDirectory: string) {
    const childProcess = spawn(parentDirectory + osm2pgsqlUrl,
        ['-a', '--slim', '-d', process.env.dbname!, '-P', process.env.DBport!, '-U', process.env.user!, '--password', '-H',
            process.env.hostname!, '--extra-attributes', '-S', parentDirectory + defaultStyleUrl, parentDirectory + mapDataUrl]);

    // Handle stdout data
    childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);

    });

    // Handle stderr data
    childProcess.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    // Provide password input
    childProcess.stdin.write(process.env.password!+"\n");

    // Handle process exit
    childProcess.on('exit', (code) => {
        console.log(`Child process exited with code ${code}`);
    });
}

interface DateCustomRequest extends NextApiRequest {
    query: {
      dateMode?: "byHour"|"byDay";
    };
  }

export default async function byDate(req: DateCustomRequest, res: NextApiResponse) {
    // get dateMode from req.query
    const dateMode = req.query.dateMode
    // if dateMode is not byDay or byHour, return error
    if (dateMode!=="byDay"&&dateMode!=="byHour") {
        res.status(400).json({
            state:"failed",
            message:"dateMode must be byDay or byHour"
        })
        return
    }
    let parentDirectory = getParentDirectory()

    // start checking hcm osm update date 
    const response = await axios.get(urlForTrackingHCMOsmDate);
    const data = await response.data

    // find "abbr" element in this response.data string
    const abbrIndex = data.indexOf("abbr");
    // get the title of abbr element
    const title = data.substring(abbrIndex + 12, data.indexOf(">", abbrIndex) - 1);
    // title now is Date String, turn it to date
    const date = new Date(title);
    // turn dates in updatedDates to date
    let lastOsmMapUpdatedDate = new Date(updatedDates.lastOsmMapUpdatedDate)
    let lastAppMapUpdatedDate = new Date(updatedDates.lastAppMapUpdatedDate)

    
    // instantly update the lastOsmMapUpdatedDate to file updatedDates.ts
    // @ts-ignore
    if (date > lastAppMapUpdatedDate) {
        if(date > lastOsmMapUpdatedDate)
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
        // calculate the difference in days and hours
        // @ts-ignore
        const diff = date - lastAppMapUpdatedDate;
        // check if diff is larger than 1 day
        if ((dateMode==="byDay"&&diff >= 1000 * 60 * 60 * 24)||(dateMode==="byHour"&&diff >= 1000 * 60 * 60)) {
            // update the map
            console.log("Fetching new HCM city osm\n")
            // catch error
            try {
                await fetchDataFromTPHCMOsm(parentDirectory)
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    state:"failed",
                    message:"Error fetching new HCM city osm"
                })
                return
            }
            console.log("Finished fetching new data, start updating to postgis\n")
            // catch error
            try {
                await updateToPostgis(parentDirectory)
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    state:"failed",
                    message:"Error updating to postgis"
                })
                return
            }
            console.log("Finished updating to postgis\n")
            // update lastAppMapUpdatedDate
            fs.writeFileSync(parentDirectory + updateDatesUrl, `const updatedDates = {
    lastAppMapUpdatedDate: "${date.toISOString()}",
    lastOsmMapUpdatedDate: "${date.toISOString()}"
        }
        
export default updatedDates;`, 
            // @ts-ignore
            (err) => {
                if (err) throw err;
                console.log('Data written to file');
                }
            );
            
            // response
            res.status(200).json({
                state:"success",
                lastAppMapUpdatedDate: lastOsmMapUpdatedDate,
                lastOsmMapUpdatedDate: lastOsmMapUpdatedDate,
                message:"Updated HCM city map successfully"
            })
        }
        else
        {
            // response
            res.status(200).json({
                state:"failed",
                lastAppMapUpdatedDate: lastAppMapUpdatedDate,
                lastOsmMapUpdatedDate: lastOsmMapUpdatedDate,
                message:"Time difference less than 1 " + (dateMode==="byDay"?"day":dateMode==="byHour"?"hour":"") + " so no need to update HCM city map"
            })
        }
    }
    else
    {
        // response
        res.status(200).json({
            state:"failed",
            lastAppMapUpdatedDate: lastAppMapUpdatedDate,
            lastOsmMapUpdatedDate: lastOsmMapUpdatedDate,
            message:"HCM city map is up to date"
        })
    }
}