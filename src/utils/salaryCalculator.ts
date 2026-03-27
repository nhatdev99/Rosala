import { isSameMonth, parseISO } from 'date-fns';

export type SalaryCalcMode = 'manual' | 'auto';
export type WorkDayMode = 'month' | 'custom';

export interface ShiftConfig {
  baseHours: number;
  overtimeHours: number;
  baseRate: number;
  overtimeRate: number;
  extraHours?: number;
  extraRate?: number;
  calcMode?: SalaryCalcMode;
  baseSalary?: number;
  workDayMode?: WorkDayMode;
  customWorkDays?: number;
  overtimeMultiplier?: number;
  extraMultiplier?: number;
  allowance?: number;
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
  extra: number;
  allowance: number;
  total: number;
}

export interface MonthlySalary {
  month: string; // Định dạng YYYY-MM
  totalBaseSalary: number;
  totalOvertimeSalary: number;
  totalExtraSalary: number;
  totalAllowanceSalary: number;
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
  const rates = resolveShiftRates(
    shiftConfig,
    record.date
  );
  
  // Dựa trên số giờ làm thực tế và config của loại ca đó
  const base = record.actualHours * rates.baseRate;
  const ot =
    record.overtimeHours *
    rates.overtimeRate;
  const extra =
    (shiftConfig.extraHours || 0) *
    rates.extraRate;
  const allowance = shiftConfig.allowance || 0;
  
  return {
    base,
    ot,
    extra,
    allowance,
    total: base + ot + extra + allowance,
  };
};

export function resolveShiftRates(
  shiftConfig: ShiftConfig,
  date: string
) {
  const isAuto =
    shiftConfig.calcMode === 'auto';
  if (!isAuto) {
    return {
      baseRate: shiftConfig.baseRate,
      overtimeRate:
        shiftConfig.overtimeRate,
      extraRate:
        shiftConfig.extraRate || 0,
    };
  }

  const baseSalary =
    shiftConfig.baseSalary || 0;
  const baseHours =
    shiftConfig.baseHours || 0;
  const monthDays = new Date(
    parseISO(date).getFullYear(),
    parseISO(date).getMonth() + 1,
    0
  ).getDate();

  const workDays =
    shiftConfig.workDayMode === 'custom'
      ? shiftConfig.customWorkDays || 0
      : monthDays;

  const hourly =
    workDays > 0 && baseHours > 0
      ? baseSalary /
        (workDays * baseHours)
      : 0;

  const overtimeRate =
    hourly *
    (shiftConfig.overtimeMultiplier ||
      1);
  const extraRate =
    hourly *
    (shiftConfig.extraMultiplier ||
      1);

  return {
    baseRate: hourly,
    overtimeRate,
    extraRate,
  };
}

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
  let totalExtraSalary = 0;
  let totalAllowanceSalary = 0;
  let totalHours = 0;
  let totalOvertimeHours = 0;
  
  monthlyRecords.forEach((record) => {
    const daily = calculateDailySalary(record, config);
    totalBaseSalary += daily.base;
    totalOvertimeSalary += daily.ot;
    totalExtraSalary += daily.extra;
    totalAllowanceSalary += daily.allowance;
    totalHours += record.actualHours;
    totalOvertimeHours += record.overtimeHours;
  });
  
  const totalSalary =
    totalBaseSalary +
    totalOvertimeSalary +
    totalExtraSalary +
    totalAllowanceSalary;
  const taxRate = config.taxRate || 0;
  const taxAmount = (totalSalary * taxRate) / 100;
  const netSalary = totalSalary - taxAmount;

  return {
    month: targetMonth,
    totalBaseSalary,
    totalOvertimeSalary,
    totalExtraSalary,
    totalAllowanceSalary,
    totalSalary,
    taxAmount,
    netSalary,
    totalDays: monthlyRecords.length,
    totalHours,
    totalOvertimeHours,
  };
};
