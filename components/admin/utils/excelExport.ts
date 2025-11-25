import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 * @param data - Array of objects to export
 * @param filename - Name of the Excel file (without extension)
 * @param sheetName - Name of the worksheet
 */
export const exportToExcel = <T extends Record<string, any>>(
    data: T[],
    filename: string,
    sheetName: string = 'Sheet1'
): void => {
    if (data.length === 0) {
        alert('Dışa aktarılacak veri yok!');
        return;
    }

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Format date for Excel export (Turkish locale)
 */
export const formatDateForExcel = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch {
        return dateString;
    }
};
