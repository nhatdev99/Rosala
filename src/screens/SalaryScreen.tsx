import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSalaryStore } from '../store/useSalaryStore';
import { calculateMonthlySalary } from '../utils/salaryCalculator';
import { format } from 'date-fns';
import { useAppTheme } from '../hooks/useAppTheme';

export default function SalaryScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const records = useSalaryStore((state) => state.attendance);
  const config = useSalaryStore((state) => state.config);
  const updateConfig = useSalaryStore((state) => state.updateConfig);
  
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));
  const monthlySalary = calculateMonthlySalary(records, config, currentMonth);
  
  const handleTaxRateChange = (text: string) => {
    const cleanText = text.replace(/[^0-9.]/g, '');
    if (cleanText === '') {
      updateConfig({ taxRate: 0 });
    } else {
      const num = parseFloat(cleanText);
      if (!isNaN(num)) {
         updateConfig({ taxRate: num });
      }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>Kỳ lương hiện tại</Text>
          <Text style={styles.headerTitle}>Tháng {currentMonth}</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="filter" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainCanvas}>
        {/* Total Salary Card (Hero) */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.iconCircle}>
              <Ionicons name="wallet" size={24} color={theme.colors.onPrimary} />
            </View>
            <Text style={styles.heroLabel}>Tổng thực nhận (sau thuế)</Text>
          </View>
          <Text style={styles.heroAmount}>{monthlySalary.netSalary.toLocaleString('vi-VN')} ₫</Text>
          
          <View style={styles.heroBottomRow}>
            <Text style={styles.heroStatus}>Khấu trừ: -{monthlySalary.taxAmount.toLocaleString('vi-VN')} ₫</Text>
            <TouchableOpacity style={styles.detailBtn}>
              <Text style={styles.detailBtnText}>Chi tiết</Text>
              <Ionicons name="arrow-forward" size={14} color={theme.colors.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Salary Breakdown (Two Columns) */}
        <View style={styles.breakdownRow}>
          <View style={styles.breakdownCard}>
            <View style={[styles.smallIconCircle, { backgroundColor: theme.colors.secondaryContainer }]}>
              <Ionicons name="cash-outline" size={16} color={theme.colors.onSecondaryContainer} />
            </View>
            <Text style={styles.breakdownLabel}>Tổng lương Gross</Text>
            <Text style={styles.breakdownAmount}>{monthlySalary.totalSalary.toLocaleString('vi-VN')} ₫</Text>
          </View>
          
          <View style={styles.breakdownCard}>
            <View style={[styles.smallIconCircle, { backgroundColor: theme.colors.tertiaryContainer }]}>
              <Ionicons name="receipt-outline" size={16} color={theme.colors.onTertiaryContainer} />
            </View>
            <Text style={styles.breakdownLabel}>Cài đặt Thuế (%)</Text>
            <View style={styles.taxInputRow}>
              <TextInput
                style={styles.taxInput}
                keyboardType="numeric"
                value={config.taxRate ? config.taxRate.toString() : ''}
                onChangeText={handleTaxRateChange}
                placeholder="0"
                placeholderTextColor={theme.colors.outline}
              />
              <Text style={styles.breakdownAmount}>%</Text>
            </View>
          </View>
        </View>

        {/* Time Summary */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Thống kê thời gian</Text>
        </View>

        <View style={styles.statsContainer}>
          <StatRow 
            icon="calendar-outline" 
            iconColor={theme.colors.primary} 
            label="Tổng số ca làm" 
            value={`${monthlySalary.totalDays} ca`} 
          />
          <View style={styles.divider} />
          <StatRow 
            styles={styles}
            icon="briefcase-outline" 
            iconColor={theme.colors.secondary} 
            label="Tổng giờ làm cơ bản" 
            value={`${monthlySalary.totalHours} h`} 
          />
          <View style={styles.divider} />
          <StatRow 
            styles={styles}
            icon="flash-outline" 
            iconColor={theme.colors.tertiary} 
            label="Tổng giờ tăng ca" 
            value={`${monthlySalary.totalOvertimeHours} h`} 
          />
        </View>

      </View>
    </ScrollView>
  );
}

const StatRow = ({ styles, icon, iconColor, label, value }: any) => (
  <View style={styles.statRow}>
    <View style={styles.statLeft}>
      <View style={[styles.statIconWrapper, { backgroundColor: iconColor + '1A' }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  headerTitleContainer: {
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: theme.typography.label,
    color: theme.colors.outline,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: theme.typography.headline,
    color: theme.colors.onSurface,
    letterSpacing: -0.5,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCanvas: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  heroCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  heroLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.colors.onPrimary,
    marginBottom: 24,
    letterSpacing: -1,
  },
  heroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 16,
  },
  heroStatus: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailBtnText: {
    fontSize: 14,
    color: theme.colors.onPrimary,
    fontWeight: '600',
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  breakdownCard: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerLowest,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  smallIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  breakdownLabel: {
    fontSize: 13,
    color: theme.colors.outline,
    marginBottom: 4,
    fontWeight: '500',
  },
  breakdownAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  taxInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taxInput: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
    padding: 0,
    marginRight: 4,
    minWidth: 30,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primaryContainer,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: theme.typography.headline,
    color: theme.colors.onSurface,
  },
  statsContainer: {
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: 20,
    padding: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 15,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 16,
  },
});

