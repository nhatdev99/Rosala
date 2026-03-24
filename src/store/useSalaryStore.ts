import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AttendanceRecord,
  SalaryConfig,
  ShiftType,
} from '../utils/salaryCalculator';

export interface SalaryState {
  config: SalaryConfig;
  attendance: AttendanceRecord[];
  
  // Actions
  updateConfig: (
    config: Partial<SalaryConfig>
  ) => void;
  addRecord: (
    record: AttendanceRecord
  ) => void;
  updateRecord: (
    id: string,
    record: Partial<AttendanceRecord>
  ) => void;
  deleteRecord: (id: string) => void;

  /**
   * Tạo bản ghi check-in mới
   * @param date YYYY-MM-DD
   * @param shiftType loại ca làm
   */
  checkIn: (
    date: string,
    shiftType: ShiftType
  ) => void;

  /**
   * Ghi check-out cho bản ghi,
   * tự tính actualHours
   */
  checkOut: (id: string) => void;
}

const defaultConfig: SalaryConfig = {
  day: {
    baseHours: 9.5,
    overtimeHours: 1.5,
    baseRate: 100000,
    overtimeRate: 150000,
  },
  night: {
    baseHours: 9.5,
    overtimeHours: 1.5,
    baseRate: 120000,
    overtimeRate: 180000,
  },
  offDay: {
    baseHours: 9.5,
    overtimeHours: 1.5,
    baseRate: 200000,
    overtimeRate: 250000,
  },
  offNight: {
    baseHours: 9.5,
    overtimeHours: 1.5,
    baseRate: 250000,
    overtimeRate: 300000,
  },
  taxRate: 0,
};

export const useSalaryStore = create<SalaryState>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      attendance: [],

      updateConfig: (newConfig) =>
        set((state) => ({
          config: {
            ...state.config,
            ...newConfig,
          },
        })),
        
      addRecord: (record) =>
        set((state) => ({
          attendance: [
            ...state.attendance,
            record,
          ],
        })),
        
      updateRecord: (id, recordUpdate) =>
        set((state) => ({
          attendance: state.attendance.map(
            (r) =>
              r.id === id
                ? { ...r, ...recordUpdate }
                : r
          ),
        })),
        
      deleteRecord: (id) =>
        set((state) => ({
          attendance:
            state.attendance.filter(
              (r) => r.id !== id
            ),
        })),

      // Check-in: Tạo record mới
      checkIn: (date, shiftType) => {
        const now = new Date().toISOString();
        const id = `${date}-${Date.now()}`;
        const { config } = get();
        const shiftCfg = config[shiftType];

        const newRecord: AttendanceRecord = {
          id,
          date,
          shiftType,
          actualHours: 0,
          overtimeHours: 0,
          checkInTime: now,
        };

        set((state) => ({
          attendance: [
            ...state.attendance,
            newRecord,
          ],
        }));
      },

      // Check-out: Tính giờ làm thực tế
      checkOut: (id) => {
        const now = new Date();
        const nowISO = now.toISOString();

        set((state) => ({
          attendance: state.attendance.map(
            (r) => {
              if (r.id !== id) return r;
              if (!r.checkInTime) return r;

              // Tính số giờ thực tế
              const checkIn = new Date(
                r.checkInTime
              );
              const diffMs =
                now.getTime() -
                checkIn.getTime();
              const diffHours =
                diffMs / (1000 * 60 * 60);
              const rounded =
                Math.round(
                  diffHours * 100
                ) / 100;

              // Lấy config ca để tính OT
              const { config } = get();
              const shiftCfg =
                config[r.shiftType];
              const baseH =
                shiftCfg.baseHours;
              const actual = Math.min(
                rounded,
                baseH
              );
              const ot = Math.max(
                0,
                rounded - baseH
              );

              return {
                ...r,
                checkOutTime: nowISO,
                actualHours: actual,
                overtimeHours:
                  Math.round(ot * 100) /
                  100,
              };
            }
          ),
        }));
      },
    }),
    {
      name: 'salary-storage',
      storage: createJSONStorage(
        () => AsyncStorage
      ),
    }
  )
);

