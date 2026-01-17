const XLSX = require('xlsx');
const path = require('path');

const filePath = 'C:\\Users\\aryan\\Downloads\\yashperrr updated\\Items.xls';

try {
    const workbook = XLSX.readFile(filePath);
    console.log('--- EXCEL DEEP INSPECTION ---');
    console.log('Sheet Names:', workbook.SheetNames);

    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log(`\n--- Sheet: ${sheetName} ---`);
        console.log('Headers:', data[0]);
        console.log('Rows 1-5:');
        data.slice(1, 6).forEach((row, i) => console.log(`Row ${i + 1}:`, row));
        console.log('Total Rows:', data.length);
    });
} catch (error) {
    console.error('Error reading Excel file:', error.message);
}
