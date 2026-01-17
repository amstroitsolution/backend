const XLSX = require('xlsx');
const filePath = 'C:\\Users\\aryan\\Downloads\\yashperrr updated\\Items.xls';

const workbook = XLSX.readFile(filePath);
const ws = workbook.Sheets['Romil'];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

console.log('--- ROMIL COLUMN INDEX MAPPING ---');
const headers = data[0]; // Wait, if headers are missing, index 0 is first row
data.slice(0, 10).forEach((row, i) => {
    console.log(`Row ${i}:`, row.map((val, idx) => `${idx}: ${val}`).join(' | '));
});
