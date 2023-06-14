import { NextApiRequest, NextApiResponse } from 'next';
import {spawn} from 'child_process'
import path from 'path';

export default (req: NextApiRequest, res: NextApiResponse) => {
  let parentDirectory = path.resolve(__dirname).substring(0, path.resolve(__dirname).lastIndexOf('\\'))
  parentDirectory = parentDirectory.substring(0, parentDirectory.lastIndexOf('\\'))
  parentDirectory = parentDirectory.substring(0, parentDirectory.lastIndexOf('\\'))

  const childProcess = spawn('osm2pgsql', 
  ['-a','--slim', '-d', process.env.dbname!, '-P', process.env.DBport!, '-U',  process.env.user!, '--password', '-H', 
  process.env.hostname!, '--extra-attributes', '-S', parentDirectory+"\\src\\pages\\api\\data\\default.style" , parentDirectory+"\\src\\pages\\api\\data\\map.osm"]);

  // Handle stdout data
  childProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);

  });

  // Handle stderr data
  childProcess.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
  });

  // Provide password input
  childProcess.stdin.write('trivandeptrai\n');

  // Handle process exit
  childProcess.on('exit', (code) => {
      console.log(`Child process exited with code ${code}`);
  });

}