import { parse } from 'csv-parse';
import { createReadStream } from 'fs';

createReadStream('./src/data.csv')
  .pipe(parse({ delimiter: ',', from_line: 2 }))
  .on('data', (row) => {
    fetch('http://localhost:3333/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: row[0],
        description: row[1]
      })
    })
  })