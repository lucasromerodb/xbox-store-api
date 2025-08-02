// import fs from 'node:fs';
// import { readdirSync } from 'node:fs';

// const getDirectories = (source) =>
//   readdirSync(source, { withFileTypes: true })
//     .filter((dirent) => dirent.isDirectory())
//     .map((dirent) => dirent.name);

// const removeOlderFolders = () => {
//   const directories = getDirectories('./output');

//   for (const dir of directories) {
//     const dateToCheck = new Date(dir);
//     const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // calculate the date one week ago

//     if (dateToCheck.getTime() < oneWeekAgo.getTime()) {
//       console.log(`❌ ${dir} is older than 7 days. Removed from ./output/ directory`);
//       fs.rmSync(`./output/${dir}`, { recursive: true, force: true });
//     } else {
//       console.log(`👍 ${dir} is not older than 7 days. It will be kept.`);
//     }
//   }
// };

// export default removeOlderFolders;
