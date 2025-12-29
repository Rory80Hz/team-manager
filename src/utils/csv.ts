export const toCSV = (data: any[], headers: string[]): string => {
  const headerRow = headers.join(',');
  const rows = data.map(row => {
    return headers.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes if contains comma or quote
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });
  return [headerRow, ...rows].join('\n');
};

export const parseCSV = (csvText: string): any[] => {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  return lines.slice(1).map(line => {
    const values: string[] = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          currentValue += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue);

    return headers.reduce((obj, header, index) => {
      obj[header] = values[index]?.trim() || '';
      return obj;
    }, {} as any);
  });
};
