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
import { ShiftType } from '../utils/salaryCalculator';

// Nhãn và icon cho từng loại ca
const SHIFTS: {
  key: ShiftType;
  label: string;
  icon: string;
  color: string;
}[] = [
  {
    key: 'day',
    label: 'Ca ngày',
    icon: 'sunny',
    color: '#FF9800',
  },
  {
    key: 'night',
    label: 'Ca đêm',
    icon: 'moon',
    color: '#5C6BC0',
  },
  {
    key: 'offDay',
    label: 'Nghỉ (ngày)',
    icon: 'sunny-outline',
    color: '#26A69A',
  },
  {
    key: 'offNight',
    label: 'Nghỉ (đêm)',
    icon: 'moon-outline',
    color: '#7E57C2',
  },
];

// Nhãn cho từng trường
const FIELD_LABELS: Record<
  string,
  { label: string; suffix: string }
> = {
  baseHours: {
    label: 'Giờ cơ bản',
    suffix: 'h',
  },
  overtimeHours: {
    label: 'Giờ tăng ca',
    suffix: 'h',
  },
  baseRate: {
    label: 'Đơn giá cơ bản',
    suffix: '₫/h',
  },
  overtimeRate: {
    label: 'Đơn giá tăng ca',
    suffix: '₫/h',
  },
  extraHours: {
    label: 'Giờ phụ',
    suffix: 'h',
  },
  extraRate: {
    label: 'Đơn giá giờ phụ',
    suffix: '₫/h',
  },
};

const FIELDS = [
  'baseHours',
  'overtimeHours',
  'baseRate',
  'overtimeRate',
] as const;

export default function SalaryConfigScreen({
  navigation,
}: any) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const config = useSalaryStore(
    (s) => s.config
  );
  const updateConfig = useSalaryStore(
    (s) => s.updateConfig
  );

  // Tab hiện tại (loại ca)
  const [activeShift, setActiveShift] =
    useState<ShiftType>('day');

  // Local state cho input
  const currentShift =
    config[activeShift];
  const [formValues, setFormValues] =
    useState<Record<string, string>>({
      baseHours:
        currentShift.baseHours.toString(),
      overtimeHours:
        currentShift.overtimeHours.toString(),
      baseRate:
        currentShift.baseRate.toString(),
      overtimeRate:
        currentShift.overtimeRate.toString(),
      extraHours: (
        currentShift.extraHours ?? 0
      ).toString(),
      extraRate: (
        currentShift.extraRate ?? 0
      ).toString(),
    });

  // Khi đổi tab ca
  const handleSwitchShift = (
    shift: ShiftType
  ) => {
    setActiveShift(shift);
    const s = config[shift];
    setFormValues({
      baseHours: s.baseHours.toString(),
      overtimeHours:
        s.overtimeHours.toString(),
      baseRate: s.baseRate.toString(),
      overtimeRate:
        s.overtimeRate.toString(),
      extraHours: (
        s.extraHours ?? 0
      ).toString(),
      extraRate: (
        s.extraRate ?? 0
      ).toString(),
    });
  };

  // Cập nhật giá trị input
  const handleChange = (
    field: string,
    value: string
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Lưu config
  const handleSave = () => {
    const parsed = {
      baseHours:
        parseFloat(formValues.baseHours) ||
        0,
      overtimeHours:
        parseFloat(
          formValues.overtimeHours
        ) || 0,
      baseRate:
        parseFloat(formValues.baseRate) ||
        0,
      overtimeRate:
        parseFloat(
          formValues.overtimeRate
        ) || 0,
      extraHours:
        parseFloat(
          formValues.extraHours
        ) || 0,
      extraRate:
        parseFloat(
          formValues.extraRate
        ) || 0,
    };

    // Validation
    if (
      parsed.baseHours <= 0 ||
      parsed.baseRate <= 0
    ) {
      Alert.alert(
        'Lỗi',
        'Giờ cơ bản và đơn giá cơ bản phải lớn hơn 0.'
      );
      return;
    }

    updateConfig({
      [activeShift]: parsed,
    });

    Alert.alert(
      'Đã lưu!',
      `Cập nhật hệ số lương cho "${SHIFTS.find((s) => s.key === activeShift)?.label}" thành công.`
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          style={styles.backBtn}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Cài đặt hệ số lương
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Shift Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        style={styles.tabsScroll}
        contentContainerStyle={
          styles.tabsContainer
        }
      >
        {SHIFTS.map((shift) => {
          const isActive =
            activeShift === shift.key;
          return (
            <TouchableOpacity
              key={shift.key}
              style={[
                styles.shiftTab,
                isActive && {
                  backgroundColor:
                    shift.color,
                  borderColor:
                    shift.color,
                },
              ]}
              onPress={() =>
                handleSwitchShift(
                  shift.key
                )
              }
            >
              <Ionicons
                name={shift.icon as any}
                size={18}
                color={
                  isActive
                    ? '#fff'
                    : shift.color
                }
              />
              <Text
                style={[
                  styles.shiftTabText,
                  isActive && {
                    color: '#fff',
                  },
                ]}
              >
                {shift.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {[
          ...FIELDS,
          ...(activeShift === 'night' ||
          activeShift === 'offNight'
            ? ([
                'extraHours',
                'extraRate',
              ] as const)
            : []),
        ].map((field) => {
          const {
            label,
            suffix,
          } = FIELD_LABELS[field];
          return (
            <View
              key={field}
              style={styles.fieldCard}
            >
              <Text
                style={styles.fieldLabel}
              >
                {label}
              </Text>
              <View
                style={
                  styles.fieldInputRow
                }
              >
                <TextInput
                  style={styles.fieldInput}
                  keyboardType="numeric"
                  value={formValues[field]}
                  onChangeText={(v) =>
                    handleChange(field, v)
                  }
                  placeholder="0"
                  placeholderTextColor={
                    theme.colors.outline
                  }
                />
                <Text
                  style={styles.fieldSuffix}
                >
                  {suffix}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Preview */}
        <View style={styles.previewCard}>
          <Text
            style={styles.previewTitle}
          >
            Xem trước lương 1 ca
          </Text>
          <View style={styles.previewRow}>
            <Text
              style={
                styles.previewLabel
              }
            >
              Lương cơ bản
            </Text>
            <Text
              style={
                styles.previewValue
              }
            >
              {(
                (parseFloat(
                  formValues.baseHours
                ) || 0) *
                (parseFloat(
                  formValues.baseRate
                ) || 0)
              ).toLocaleString('vi-VN')}{' '}
              ₫
            </Text>
          </View>
          <View style={styles.previewRow}>
            <Text
              style={
                styles.previewLabel
              }
            >
              Lương tăng ca
            </Text>
            <Text
              style={
                styles.previewValue
              }
            >
              {(
                (parseFloat(
                  formValues.overtimeHours
                ) || 0) *
                (parseFloat(
                  formValues.overtimeRate
                ) || 0)
              ).toLocaleString('vi-VN')}{' '}
              ₫
            </Text>
          </View>
          {(activeShift === 'night' ||
            activeShift ===
              'offNight') && (
            <View style={styles.previewRow}>
              <Text
                style={
                  styles.previewLabel
                }
              >
                Lương giờ phụ
              </Text>
              <Text
                style={
                  styles.previewValue
                }
              >
                {(
                  (parseFloat(
                    formValues.extraHours
                  ) || 0) *
                  (parseFloat(
                    formValues.extraRate
                  ) || 0)
                ).toLocaleString('vi-VN')}{' '}
                ₫
              </Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.previewRow}>
            <Text
              style={
                styles.previewLabelBold
              }
            >
              Tổng 1 ca
            </Text>
            <Text
              style={
                styles.previewValueBold
              }
            >
              {(
                (parseFloat(
                  formValues.baseHours
                ) || 0) *
                  (parseFloat(
                    formValues.baseRate
                  ) || 0) +
                (parseFloat(
                  formValues.overtimeHours
                ) || 0) *
                  (parseFloat(
                    formValues.overtimeRate
                  ) || 0)
                +
                (parseFloat(
                  formValues.extraHours
                ) || 0) *
                  (parseFloat(
                    formValues.extraRate
                  ) || 0)
              ).toLocaleString('vi-VN')}{' '}
              ₫
            </Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
        >
          <Ionicons
            name="checkmark-circle"
            size={22}
            color={theme.colors.onPrimary}
          />
          <Text style={styles.saveBtnText}>
            Lưu thay đổi
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  contentContainer: {
    paddingBottom: 120,
  },
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
    backgroundColor:
      theme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: theme.typography.headline,
    color: theme.colors.onSurface,
  },
  tabsScroll: {
    maxHeight: 60,
    marginBottom: 24,
  },
  tabsContainer: {
    paddingHorizontal: 24,
    gap: 10,
  },
  shiftTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor:
      theme.colors.surfaceContainerLowest,
  },
  shiftTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  fieldCard: {
    backgroundColor:
      theme.colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.outline,
    marginBottom: 8,
  },
  fieldInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.onSurface,
    padding: 0,
  },
  fieldSuffix: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.outline,
    marginLeft: 8,
  },
  previewCard: {
    backgroundColor:
      theme.colors.primaryContainer,
    borderRadius: 20,
    padding: 20,
    marginTop: 12,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color:
      theme.colors.onPrimaryContainer,
    marginBottom: 16,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 14,
    color:
      theme.colors.onPrimaryContainer,
    opacity: 0.7,
  },
  previewValue: {
    fontSize: 14,
    fontWeight: '600',
    color:
      theme.colors.onPrimaryContainer,
  },
  previewLabelBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color:
      theme.colors.onPrimaryContainer,
  },
  previewValueBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color:
      theme.colors.onPrimaryContainer,
  },
  divider: {
    height: 1,
    backgroundColor:
      'rgba(0,0,0,0.1)',
    marginVertical: 8,
  },
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.onPrimary,
  },
});
