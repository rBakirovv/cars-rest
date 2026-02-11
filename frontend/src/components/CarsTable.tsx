import { useState, useRef, useCallback, useEffect } from "react";
import { Car, SortConfig } from "../types";

interface Column {
  key: keyof Car;
  label: string;
  width: number;
  minWidth: number;
  format?: (value: unknown) => string;
}

interface CarsTableProps {
  cars: Car[];
  sortConfig: SortConfig | null;
  onSort: (field: string) => void;
  onView: (car: Car) => void;
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
}

const formatPrice = (price: unknown): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price as number);
};

const formatMileage = (mileage: unknown): string => {
  return new Intl.NumberFormat("ru-RU").format(mileage as number) + " км";
};

const initialColumns: Column[] = [
  { key: "brand", label: "Бренд", width: 120, minWidth: 80 },
  { key: "model", label: "Модель", width: 120, minWidth: 80 },
  { key: "year", label: "Год", width: 80, minWidth: 60 },
  {
    key: "price",
    label: "Цена",
    width: 140,
    minWidth: 100,
    format: formatPrice,
  },
  {
    key: "mileage",
    label: "Пробег",
    width: 120,
    minWidth: 80,
    format: formatMileage,
  },
  { key: "color", label: "Цвет", width: 100, minWidth: 70 },
  { key: "vin", label: "VIN", width: 180, minWidth: 150 },
];

const SortIcon = ({
  field,
  sortConfig,
}: {
  field: string;
  sortConfig: SortConfig | null;
}) => {
  if (!sortConfig || sortConfig.field !== field) {
    return (
      <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    );
  }

  return sortConfig.order === "asc" ? (
    <svg
      className="w-4 h-4 text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  ) : (
    <svg
      className="w-4 h-4 text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
};

export const CarsTable = ({
  cars,
  sortConfig,
  onSort,
  onView,
  onEdit,
  onDelete,
}: CarsTableProps) => {
  const [columns, setColumns] = useState(initialColumns);
  const [resizing, setResizing] = useState<{
    index: number;
    startX: number;
    startWidth: number;
  } | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const handleMouseDown = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.preventDefault();
      setResizing({
        index,
        startX: e.clientX,
        startWidth: columns[index].width,
      });
    },
    [columns],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!resizing) return;

      const diff = e.clientX - resizing.startX;
      const newWidth = Math.max(
        columns[resizing.index].minWidth,
        resizing.startWidth + diff,
      );

      setColumns((prev) =>
        prev.map((col, i) =>
          i === resizing.index ? { ...col, width: newWidth } : col,
        ),
      );
    },
    [resizing, columns],
  );

  const handleMouseUp = useCallback(() => {
    setResizing(null);
  }, []);

  useEffect(() => {
    if (resizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [resizing, handleMouseMove, handleMouseUp]);

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table ref={tableRef} className="w-full" style={{ tableLayout: "fixed" }}>
        <colgroup>
          {columns.map((col, i) => (
            <col key={i} style={{ width: col.width }} />
          ))}
          <col style={{ width: 120 }} />
        </colgroup>
        <thead className="bg-gray-50 border-b">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key}
                className="relative px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none"
              >
                <button
                  className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  onClick={() => onSort(column.key)}
                >
                  {column.label}
                  <SortIcon field={column.key} sortConfig={sortConfig} />
                </button>
                <div
                  className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500 group"
                  onMouseDown={(e) => handleMouseDown(index, e)}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-gray-300 group-hover:bg-blue-500" />
                </div>
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cars.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-4 py-8 text-center text-gray-500"
              >
                Ничего не найдено
              </td>
            </tr>
          ) : (
            cars.map((car) => (
              <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm text-gray-900 truncate"
                    title={String(car[column.key])}
                  >
                    {column.format
                      ? column.format(car[column.key])
                      : String(car[column.key])}
                  </td>
                ))}
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onView(car)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="View"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEdit(car)}
                      className="text-yellow-600 hover:text-yellow-800 transition-colors"
                      title="Edit"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(car)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
