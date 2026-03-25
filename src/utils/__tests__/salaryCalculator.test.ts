import {
  SalaryConfig,
  AttendanceRecord,
  calculateDailySalary,
  calculateMonthlySalary,
} from '../salaryCalculator';

describe('salaryCalculator', () => {
  const mockConfig: SalaryConfig = {
    day: { baseHours: 8, baseRate: 100, overtimeHours: 2, overtimeRate: 150 },
    night: { baseHours: 8, baseRate: 120, overtimeHours: 2, overtimeRate: 180 },
    offDay: { baseHours: 8, baseRate: 200, overtimeHours: 2, overtimeRate: 250 },
    offNight: { baseHours: 8, baseRate: 250, overtimeHours: 2, overtimeRate: 300 },
    taxRate: 0,
  };

  test('calculateDailySalary - Day shift', () => {
    const record: AttendanceRecord = {
      id: '1',
      date: '2023-10-01',
      shiftType: 'day',
      actualHours: 8,
      overtimeHours: 2,
    };

    const result = calculateDailySalary(record, mockConfig);
    expect(result.base).toBe(800); // 8 * 100
    expect(result.ot).toBe(300);   // 2 * 150
    expect(result.total).toBe(1100);
  });

  test('calculateMonthlySalary - Only returns records for specific month', () => {
    const records: AttendanceRecord[] = [
      { id: '1', date: '2023-10-01', shiftType: 'day', actualHours: 8, overtimeHours: 0 },
      { id: '2', date: '2023-10-15', shiftType: 'night', actualHours: 8, overtimeHours: 1 },
      { id: '3', date: '2023-11-01', shiftType: 'day', actualHours: 8, overtimeHours: 0 }, // KhÃ¡c thÃ¡ng
    ];

    const result = calculateMonthlySalary(records, mockConfig, '2023-10');

    expect(result.totalDays).toBe(2);
    expect(result.totalHours).toBe(16);
    expect(result.totalOvertimeHours).toBe(1);
    
    // Day: 8 * 100 = 800
    // Night: 8 * 120 = 960, OT: 1 * 180 = 180. Total = 1140
    // Total Base = 800 + 960 = 1760
    // Total OT = 180
    // Total Salary = 1940
    expect(result.totalBaseSalary).toBe(1760);
    expect(result.totalOvertimeSalary).toBe(180);
    expect(result.totalSalary).toBe(1940);
  });
});
