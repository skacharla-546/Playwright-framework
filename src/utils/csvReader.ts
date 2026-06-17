import * as fs from 'fs';
import * as path from 'path';

export interface TestDataRow {
    [key: string]: string;
}

export function readCSV(filePath: string): TestDataRow[] {

    let fullPath = path.resolve(filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const lines = fileContent.trim().split('\n');
    const headers = lines[0].split(',');

    let testData: TestDataRow[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row: TestDataRow = {};
        for (let j = 0; j < headers.length; j++) {
            row[headers[j].trim()] = values[j]?.trim() || '';
        }
        testData.push(row);
    }

    return testData;
}