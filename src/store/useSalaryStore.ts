import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AttendanceRecord, SalaryConfig } from '../utils/salaryCalculator';

export interface SalaryState {
  config: SalaryConfig;
  attendance: AttendanceRecord[];
  
  // Actions
  updateConfig: (config: Partial<SalaryConfig>) => void;
  addRecord: (record: AttendanceRecord) => void;
  updateRecord: (id: string, record: Partial<AttendanceRecord>) => void;
  deleteRecord: (id: string) => void;
}

const defaultConfig: SalaryConfig = {
  day: { baseHours: 9.5, overtimeHours: 1.5, baseRate: 100000, overtimeRate: 150000 },
  night: { baseHours: 9.5, overtimeHours: 1.5, baseRate: 120000, overtimeRate: 180000 },
  offDay: { baseHours: 9.5, overtimeHours: 1.5, baseRate: 200000, overtimeRate: 250000 },
  offNight: { baseHours: 9.5, overtimeHours: 1.5, baseRate: 250000, overtimeRate: 300000 },
  taxRate: 0,
};

export const useSalaryStore = create<SalaryState>()(
  persist(
    (set) => ({
      config: defaultConfig,
      attendance: [],

      updateConfig: (newConfig) =>
        set((state) => ({ config: { ...state.config, ...newConfig } })),
        
      addRecord: (record) =>
        set((state) => ({ attendance: [...state.attendance, record] })),
        
      updateRecord: (id, recordUpdate) =>
        set((state) => ({
          attendance: state.attendance.map((r) =>
            r.id === id ? { ...r, ...recordUpdate } : r
          ),
        })),
        
      deleteRecord: (id) =>
        set((state) => ({
          attendance: state.attendance.filter((r) => r.id !== id),
        })),
    }),
    {
      name: 'salary-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
