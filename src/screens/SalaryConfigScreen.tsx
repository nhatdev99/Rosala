import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';
import { useSalaryStore } from '../store/useSalaryStore';
import { ShiftType, resolveShiftRates } from '../utils/salaryCalculator';

const SHIFTS: {
  key: ShiftType;
  label: string;
  icon: string;
  color: string;
}[] = [
  { key: 'day', label: 'Ca ngày', icon: 'sunny', color: '#FF9800' },
  { key: 'night', label: 'Ca đêm', icon: 'moon', color: '#5C6BC0' },
  { key: 'offDay', label: 'Nghỉ (ngày)', icon: 'sunny-outline', color: '#26A69A' },
  { key: 'offNight', label: 'Nghỉ (đêm)', icon: 'moon-outline', color: '#7E57C2' },
];

const MANUAL_FIELDS = ['baseHours', 'overtimeHours', 'baseRate', 'overtimeRate', 'extraHours', 'extraRate'] as const;
const AUTO_FIELDS = ['baseSalary', 'baseHours', 'overtimeHours', 'extraHours', 'overtimeMultiplier', 'extraMultiplier'] as const;

const FIELD_LABELS: Record<string, { label: string; suffix: string }> = {
  baseSalary: { label: 'Lương cơ bản tháng', suffix: '₫' },
  baseHours: { label: 'Số giờ làm cơ bản', suffix: 'h' },
  overtimeHours: { label: 'Số giờ tăng ca', suffix: 'h' },
  extraHours: { label: 'Số giờ phụ', suffix: 'h' },
  baseRate: { label: 'Đơn giá cơ bản', suffix: '₫/h' },
  overtimeRate: { label: 'Đơn giá tăng ca', suffix: '₫/h' },
  extraRate: { label: 'Đơn giá giờ phụ', suffix: '₫/h' },
  overtimeMultiplier: { label: 'Hệ số giờ tăng ca', suffix: 'x' },
  extraMultiplier: { label: 'Hệ số giờ phụ', suffix: 'x' },
  customWorkDays: { label: 'Số ngày công cơ bản', suffix: 'ngày' },
};

function formatInitialForm(shift: any) {
  return {
    calcMode: shift.calcMode || 'manual',
    baseSalary: String(shift.baseSalary ?? 0),
    baseHours: String(shift.baseHours ?? 0),
    overtimeHours: String(shift.overtimeHours ?? 0),
    extraHours: String(shift.extraHours ?? 0),
    baseRate: String(shift.baseRate ?? 0),
    overtimeRate: String(shift.overtimeRate ?? 0),
    extraRate: String(shift.extraRate ?? 0),
    workDayMode: shift.workDayMode || 'month',
    customWorkDays: String(shift.customWorkDays ?? 26),
    overtimeMultiplier: String(shift.overtimeMultiplier ?? 1.5),
    extraMultiplier: String(shift.extraMultiplier ?? 1),
  };
}

export default function SalaryConfigScreen({ navigation }: any) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const config = useSalaryStore((s) => s.config);
  const updateConfig = useSalaryStore((s) => s.updateConfig);

  const [activeShift, setActiveShift] = useState<ShiftType>('day');
  const [formValues, setFormValues] = useState<Record<string, string>>(formatInitialForm(config.day));

  const handleSwitchShift = (shift: ShiftType) => {
    setActiveShift(shift);
    setFormValues(formatInitialForm(config[shift]));
  };

  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const calcMode = formValues.calcMode === 'auto' ? 'auto' : 'manual';
  const workDayMode = formValues.workDayMode === 'custom' ? 'custom' : 'month';

  const parsed = {
    calcMode,
    baseSalary: parseFloat(formValues.baseSalary) || 0,
    baseHours: parseFloat(formValues.baseHours) || 0,
    overtimeHours: parseFloat(formValues.overtimeHours) || 0,
    extraHours: parseFloat(formValues.extraHours) || 0,
    baseRate: parseFloat(formValues.baseRate) || 0,
    overtimeRate: parseFloat(formValues.overtimeRate) || 0,
    extraRate: parseFloat(formValues.extraRate) || 0,
    workDayMode,
    customWorkDays: parseFloat(formValues.customWorkDays) || 0,
    overtimeMultiplier: parseFloat(formValues.overtimeMultiplier) || 0,
    extraMultiplier: parseFloat(formValues.extraMultiplier) || 0,
  };

  const previewRates = useMemo(() => resolveShiftRates(parsed as any, new Date().toISOString().slice(0, 10)), [
    formValues,
  ]);

  const handleSave = () => {
    if (parsed.baseHours <= 0) {
      Alert.alert('Lỗi', 'Giờ cơ bản phải lớn hơn 0.');
      return;
    }

    if (calcMode === 'manual' && parsed.baseRate <= 0) {
      Alert.alert('Lỗi', 'Đơn giá cơ bản phải lớn hơn 0 khi dùng chế độ thủ công.');
      return;
    }

    if (calcMode === 'auto') {
      if (parsed.baseSalary <= 0) {
        Alert.alert('Lỗi', 'Lương cơ bản tháng phải lớn hơn 0 khi dùng chế độ tự động.');
        return;
      }
      if (workDayMode === 'custom' && parsed.customWorkDays <= 0) {
        Alert.alert('Lỗi', 'Số ngày công cơ bản phải lớn hơn 0.');
        return;
      }
    }

    updateConfig({
      [activeShift]: {
        ...parsed,
        baseRate: previewRates.baseRate,
        overtimeRate: calcMode === 'auto' ? previewRates.overtimeRate : parsed.overtimeRate,
        extraRate: calcMode === 'auto' ? previewRates.extraRate : parsed.extraRate,
      },
    });

    Alert.alert('Đã lưu!', `Cập nhật hệ số lương cho "${SHIFTS.find((s) => s.key === activeShift)?.label}" thành công.`);
  };

  const renderedFields = calcMode === 'manual' ? MANUAL_FIELDS : AUTO_FIELDS;

  const baseAmount = (parseFloat(formValues.baseHours) || 0) * previewRates.baseRate;
  const overtimeAmount = (parseFloat(formValues.overtimeHours) || 0) * (calcMode === 'auto' ? previewRates.overtimeRate : parsed.overtimeRate);
  const extraAmount = (parseFloat(formValues.extraHours) || 0) * (calcMode === 'auto' ? previewRates.extraRate : parsed.extraRate);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt hệ số lương</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabsContainer}>
        {SHIFTS.map((shift) => {
          const isActive = activeShift === shift.key;
          return (
            <TouchableOpacity
              key={shift.key}
              style={[styles.shiftTab, isActive && { backgroundColor: shift.color, borderColor: shift.color }]}
              onPress={() => handleSwitchShift(shift.key)}
            >
              <Ionicons name={shift.icon as any} size={18} color={isActive ? '#fff' : shift.color} />
              <Text style={[styles.shiftTabText, isActive && { color: '#fff' }]}>{shift.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.formContainer}>
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[styles.modeBtn, calcMode === 'manual' && styles.modeBtnActive]}
            onPress={() => handleChange('calcMode', 'manual')}
          >
            <Text style={[styles.modeText, calcMode === 'manual' && styles.modeTextActive]}>Thủ công</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, calcMode === 'auto' && styles.modeBtnActive]}
            onPress={() => handleChange('calcMode', 'auto')}
          >
            <Text style={[styles.modeText, calcMode === 'auto' && styles.modeTextActive]}>Tự động</Text>
          </TouchableOpacity>
        </View>

        {calcMode === 'auto' && (
          <View style={styles.dayModeWrap}>
            <Text style={styles.fieldLabel}>Số ngày công cơ bản</Text>
            <View style={styles.modeRow}>
              <TouchableOpacity
                style={[styles.modeBtn, workDayMode === 'month' && styles.modeBtnActive]}
                onPress={() => handleChange('workDayMode', 'month')}
              >
                <Text style={[styles.modeText, workDayMode === 'month' && styles.modeTextActive]}>Cả tháng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeBtn, workDayMode === 'custom' && styles.modeBtnActive]}
                onPress={() => handleChange('workDayMode', 'custom')}
              >
                <Text style={[styles.modeText, workDayMode === 'custom' && styles.modeTextActive]}>Tự nhập</Text>
              </TouchableOpacity>
            </View>
            {workDayMode === 'custom' && (
              <View style={styles.fieldCard}>
                <Text style={styles.fieldLabel}>{FIELD_LABELS.customWorkDays.label}</Text>
                <View style={styles.fieldInputRow}>
                  <TextInput
                    style={styles.fieldInput}
                    keyboardType="numeric"
                    value={formValues.customWorkDays}
                    onChangeText={(v) => handleChange('customWorkDays', v)}
                    placeholder="26"
                    placeholderTextColor={theme.colors.outline}
                  />
                  <Text style={styles.fieldSuffix}>{FIELD_LABELS.customWorkDays.suffix}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {renderedFields.map((field) => {
          const { label, suffix } = FIELD_LABELS[field];
          return (
            <View key={field} style={styles.fieldCard}>
              <Text style={styles.fieldLabel}>{label}</Text>
              <View style={styles.fieldInputRow}>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType="numeric"
                  value={formValues[field]}
                  onChangeText={(v) => handleChange(field, v)}
                  placeholder="0"
                  placeholderTextColor={theme.colors.outline}
                />
                <Text style={styles.fieldSuffix}>{suffix}</Text>
              </View>
            </View>
          );
        })}

        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Xem trước lương 1 ca ({calcMode === 'auto' ? 'Tự động' : 'Thủ công'})</Text>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Lương cơ bản</Text>
            <Text style={styles.previewValue}>{baseAmount.toLocaleString('vi-VN')} ₫</Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Lương tăng ca</Text>
            <Text style={styles.previewValue}>{overtimeAmount.toLocaleString('vi-VN')} ₫</Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Lương giờ phụ</Text>
            <Text style={styles.previewValue}>{extraAmount.toLocaleString('vi-VN')} ₫</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.previewRow}>
            <Text style={styles.previewLabelBold}>Tổng 1 ca</Text>
            <Text style={styles.previewValueBold}>{(baseAmount + overtimeAmount + extraAmount).toLocaleString('vi-VN')} ₫</Text>
          </View>
          {calcMode === 'auto' && (
            <Text style={styles.hintText}>
              Đơn giá/giờ cơ bản tự tính = Lương cơ bản tháng / (Số ngày công cơ bản × Số giờ làm cơ bản).
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Ionicons name="checkmark-circle" size={22} color={theme.colors.onPrimary} />
          <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface },
    contentContainer: { paddingBottom: 120 },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 16,
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surfaceContainerHigh,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      fontFamily: theme.typography.headline,
      color: theme.colors.onSurface,
    },
    tabsScroll: { maxHeight: 60, marginBottom: 24 },
    tabsContainer: { paddingHorizontal: 24, gap: 10 },
    shiftTab: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: 'rgba(0,0,0,0.1)',
      backgroundColor: theme.colors.surfaceContainerLowest,
    },
    shiftTabText: { fontSize: 14, fontWeight: '600', color: theme.colors.onSurface },
    formContainer: { paddingHorizontal: 24 },
    modeRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    modeBtn: {
      flex: 1,
      borderRadius: 12,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceContainerLow,
    },
    modeBtnActive: { backgroundColor: theme.colors.primaryContainer },
    modeText: { fontWeight: '600', color: theme.colors.onSurfaceVariant },
    modeTextActive: { color: theme.colors.onPrimaryContainer },
    dayModeWrap: { marginBottom: 8 },
    fieldCard: {
      backgroundColor: theme.colors.surfaceContainerLowest,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.05)',
    },
    fieldLabel: { fontSize: 13, fontWeight: '500', color: theme.colors.outline, marginBottom: 8 },
    fieldInputRow: { flexDirection: 'row', alignItems: 'center' },
    fieldInput: { flex: 1, fontSize: 22, fontWeight: '700', color: theme.colors.onSurface, padding: 0 },
    fieldSuffix: { fontSize: 14, fontWeight: '600', color: theme.colors.outline, marginLeft: 8 },
    previewCard: {
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: 20,
      padding: 20,
      marginTop: 12,
      marginBottom: 24,
    },
    previewTitle: { fontSize: 14, fontWeight: 'bold', color: theme.colors.onPrimaryContainer, marginBottom: 16 },
    previewRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    previewLabel: { fontSize: 14, color: theme.colors.onPrimaryContainer, opacity: 0.7 },
    previewValue: { fontSize: 14, fontWeight: '600', color: theme.colors.onPrimaryContainer },
    previewLabelBold: { fontSize: 16, fontWeight: 'bold', color: theme.colors.onPrimaryContainer },
    previewValueBold: { fontSize: 16, fontWeight: 'bold', color: theme.colors.onPrimaryContainer },
    hintText: { marginTop: 8, fontSize: 12, color: theme.colors.onPrimaryContainer, opacity: 0.75 },
    divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginVertical: 8 },
    saveBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 16,
      elevation: 4,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    saveBtnText: { fontSize: 16, fontWeight: 'bold', color: theme.colors.onPrimary },
  });
