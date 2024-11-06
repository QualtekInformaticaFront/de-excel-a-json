import { read, utils, WorkBook } from 'xlsx';

interface CellFormat {
  value: any;
  format?: string;
  type?: string;
}

interface ProcessedSheet {
  name: string;
  data: {
    headers: string[];
    rows: Record<string, CellFormat>[];
  };
}

export async function processExcelFile(file: File): Promise<ProcessedSheet[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, {
          type: 'array',
          cellFormula: true,
          cellStyles: true,
        });
        const result = processWorkbook(workbook);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

function processWorkbook(workbook: WorkBook): ProcessedSheet[] {
  return workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const range = utils.decode_range(sheet['!ref'] || 'A1');

    // Obtener encabezados de la primera fila, asegurando nombres únicos para las celdas vacías
    const headers: string[] = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = sheet[utils.encode_cell({ r: range.s.r, c: C })];
      headers.push(cell && cell.v ? String(cell.v) : `Column${C + 1}`);
    }

    // Procesar filas de datos
    const rows: Record<string, CellFormat>[] = [];
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      const row: Record<string, CellFormat> = {};

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = utils.encode_cell({ r: R, c: C });
        const cell = sheet[cellRef];

        if (cell) {
          const cellFormat: CellFormat = { value: cell.v };

          // Detectar y convertir fechas almacenadas como números
          if (cell.t === 'n' && cell.z && cell.z.includes('m/d/yy')) {
            // Verifica si el formato es de fecha
            const dateValue = utils.format_cell({
              v: cell.v,
              z: cell.z,
              t: 'n',
            });
            cellFormat.value = dateValue; // Almacenar la fecha en formato legible
            cellFormat.type = 'date'; // Asignar el tipo de dato como 'date'
          } else if (cell.z) {
            // Otros formatos numéricos
            if (cell.z.includes('$')) {
              cellFormat.type = 'currency';
            } else {
              cellFormat.format = cell.z;

              if (cell.z.includes('%')) {
                cellFormat.type = 'percentage';
              } else if (/[a-zA-Z]/.test(cell.z)) {
                cellFormat.type = 'unit';
              }
            }
          }

          // Eliminar "format": "General" y "type": "unit" si no aportan valor
          if (cellFormat.format === 'General') delete cellFormat.format;
          if (cellFormat.type === 'unit') delete cellFormat.type;

          // Agregar solo las celdas que contienen un valor
          if (cellFormat.value !== undefined) {
            row[headers[C] || `Column${C + 1}`] = cellFormat;
          }
        }
      }

      // Solo añadir filas que tengan datos (evita filas completamente vacías)
      if (Object.keys(row).length > 0) {
        rows.push(row);
      }
    }

    return {
      name: sheetName,
      data: {
        headers,
        rows,
      },
    };
  });
}
