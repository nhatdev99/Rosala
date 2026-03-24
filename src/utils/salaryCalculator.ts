import { isSameMonth, parseISO } from 'date-fns';

export interface ShiftConfig {
  baseHours: number;
  overtimeHours: number;
  baseRate: number;
  overtimeRate: number;
}

export interface SalaryConfig {
  day: ShiftConfig;
  night: ShiftConfig;
  offDay: ShiftConfig;
  offNight: ShiftConfig;
  taxRate: number; // Phần trăm thuế (vd: 10 nghĩa là 10%)
}

export type ShiftType = 'day' | 'night' | 'offDay' | 'offNight';

export interface AttendanceRecord {
  id: string;
  date: string; // Định dạng YYYY-MM-DD
  shiftType: ShiftType;
  actualHours: number;
  overtimeHours: number;
  checkInTime?: string; // ISO timestamp
  checkOutTime?: string; // ISO timestamp
  note?: string;
}

export interface DailySalary {
  base: number;
  ot: number;
  total: number;
}

export interface MonthlySalary {
  month: string; // Định dạng YYYY-MM
  totalBaseSalary: number;
  totalOvertimeSalary: number;
  totalSalary: number; // Trước thuế (Gross)
  taxAmount: number; // Tiền thuế
  netSalary: number; // Thực nhận sau thuế
  totalDays: number;
  totalHours: number;
  totalOvertimeHours: number;
}

/**
 * Tính toán lương cho 1 ca làm việc cụ thể
 */
export const calculateDailySalary = (
  record: AttendanceRecord,
  config: SalaryConfig
): DailySalary => {
  const shiftConfig = config[record.shiftType];
  
  // Dựa trên số giờ làm thực tế và config của loại ca đó
  const base = record.actualHours * shiftConfig.baseRate;
  const ot = record.overtimeHours * shiftConfig.overtimeRate;
  
  return {
    base,
    ot,
    total: base + ot,
  };
};

/**
 * Tính tổng lương và thống kê theo tháng
 */
export const calculateMonthlySalary = (
  records: AttendanceRecord[],
  config: SalaryConfig,
  targetMonth: string // YYYY-MM
): MonthlySalary => {
  // Lấy danh sách record thuộc tháng mục tiêu
  const targetDate = parseISO(`${targetMonth}-01`);
  const monthlyRecords = records.filter((r) => isSameMonth(parseISO(r.date), targetDate));
  
  let totalBaseSalary = 0;
  let totalOvertimeSalary = 0;
  let totalHours = 0;
  let totalOvertimeHours = 0;
  
  monthlyRecords.forEach((record) => {
    const daily = calculateDailySalary(record, config);
    totalBaseSalary += daily.base;
    totalOvertimeSalary += daily.ot;
    totalHours += record.actualHours;
    totalOvertimeHours += record.overtimeHours;
  });
  
  const totalSalary = totalBaseSalary + totalOvertimeSalary;
  const taxRate = config.taxRate || 0;
  const taxAmount = (totalSalary * taxRate) / 100;
  const netSalary = totalSalary - taxAmount;

  return {
    month: targetMonth,
    totalBaseSalary,
    totalOvertimeSalary,
    totalSalary,
    taxAmount,
    netSalary,
    totalDays: monthlyRecords.length,
    totalHours,
    totalOvertimeHours,
  };
};
