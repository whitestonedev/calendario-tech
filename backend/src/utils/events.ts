import fs from 'fs';
import * as yaml from 'js-yaml';
import path from 'path';

export const eventsJSONPath =
  process.env.NODE_ENV === 'production'
    ? path.resolve('dist/data/events.json')
    : path.resolve('src/data/events.json');

const getAllFilesFromFolder = (folderPath: string): string[] => {
  try {
    return fs
      .readdirSync(folderPath)
      .map((file) => path.join(folderPath, file));
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error reading folder: ${error.message}`);
    } else {
      console.error('Unknown error occurred');
    }
    return [];
  }
};

export const getJSONEventsList = () => {
  const YMLFolderPath = path.resolve('data/events');
  if (!fs.existsSync(YMLFolderPath)) {
    console.error(`Directory not found: ${YMLFolderPath}`);
    return;
  }

  const files = getAllFilesFromFolder(YMLFolderPath);

  try {
    const events = files.map((file) => {
      const fileContent = fs.readFileSync(file, 'utf8');
      const data = yaml.load(fileContent);
      return JSON.stringify(data, null, 2);
    });
    return events;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error reading file: ${error.message}`);
    } else {
      console.error('Unknown error occurred');
    }
    return [];
  }
};

export const getJSONEventsListGroupedByDate = () => {
  const events = getJSONEventsList();
  if (!events) {
    return;
  }

  const eventsGroupedByDate = events.reduce(
    (acc, event) => {
      const eventJSON = JSON.parse(event);
      // 2024-12-10T10:00:00" -> "2024-12-10"
      const eventDate = eventJSON.start_datetime.split('T')[0];
      if (!acc[eventDate]) {
        acc[eventDate] = [];
      }
      acc[eventDate].push(eventJSON);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  return eventsGroupedByDate;
};
