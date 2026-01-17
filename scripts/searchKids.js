const XLSX = require('xlsx');
const path = require('path');

const filePath = 'C:\\Users\\aryan\\Downloads\\yashperrr updated\\Items.xls';
const workbook = XLSX.readFile(filePath);

const keywords = ['KID', 'GIRL', 'BOY', 'BABY', 'CHIL', 'JUNIOR', 'TWEEN', 'LITTLE'];

workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let occurrences = [];
    data.forEach((row, index) => {
        const rowStr = JSON.stringify(row).toUpperCase();
        if (keywords.some(k => rowStr.includes(k))) {
            occurrences.push({ index, row });
        }
    });

    if (occurrences.length > 0) {
        console.log(`\n✅ Found ${occurrences.length} kids-related items in sheet: ${sheetName}`);
        occurrences.slice(0, 5).forEach(occ => {
            console.log(`  Row ${occ.index}:`, occ.row);
        });
    } else {
        console.log(`- Sheet ${sheetName}: No kids items found.`);
    }
});
