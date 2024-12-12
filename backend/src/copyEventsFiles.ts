import fs from 'fs';
import path from 'path';
import {
  getJSONEventsList,
  getJSONEventsListGroupedByDate,
} from './utils/events.js';

// const source = path.resolve('static');
// const destination = path.resolve('dist/static');

// const copyFolderSync = (
//   from: string = source,
//   to: string = destination,
// ): void => {
//   try {
//     fs.mkdirSync(to, { recursive: true });
//     fs.readdirSync(from).forEach((element) => {
//       const sourcePath = path.join(from, element);
//       const destinationPath = path.join(to, element);
//       if (fs.lstatSync(sourcePath).isFile()) {
//         fs.copyFileSync(sourcePath, destinationPath);
//       } else if (fs.lstatSync(sourcePath).isDirectory()) {
//         copyFolderSync(sourcePath, destinationPath);
//       }
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error(`Error copying folder: ${error.message}`);
//     } else {
//       console.error('Unknown error occurred');
//     }
//   }
// };

// copyFolderSync();
// console.log('All assets copied successfully!');

const dataPath = path.resolve('dist/data');

const updateEventsJSON = (): void => {
  const events = getJSONEventsList();
  if (events?.length === 0) {
    console.error('No events found');
    return;
  }

  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
  }
  const eventsJSONPath = path.join(dataPath, 'events.json');
  try {
    fs.writeFileSync(eventsJSONPath, `[${events?.join(',')}]`);
    console.log('Events JSON updated successfully!');
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error updating events JSON: ${error.message}`);
    } else {
      console.error('Unknown error occurred');
    }
  }
};

const updateEventsGroupedByDateJSON = (): void => {
  const eventsGroupedByDateJSONPath = path.join(
    dataPath,
    'eventsGroupedByDate.json',
  );

  const data = getJSONEventsListGroupedByDate();
  if (!data) {
    console.error('No data found');
    return;
  }

  try {
    fs.writeFileSync(
      eventsGroupedByDateJSONPath,
      JSON.stringify(data, null, 2),
    );
    console.log('Events grouped by date JSON updated successfully!');
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `Error updating events grouped by date JSON: ${error.message}`,
      );
    } else {
      console.error('Unknown error occurred');
    }
  }
};

updateEventsJSON();
updateEventsGroupedByDateJSON();
console.log('All events files updated successfully!');
