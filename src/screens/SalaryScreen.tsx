import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSalaryStore } from '../store/useSalaryStore';
import { calculateMonthlySalary } from '../utils/salaryCalculator';
import { format } from 'date-fns';
import { useAppTheme } from '../hooks/useAppTheme';

export default function SalaryScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<any>();

  const records = useSalaryStore((state) => state.attendance);
  const config = useSalaryStore((state) => state.config);
  const updateConfig = useSalaryStore((state) => state.updateConfig);

  const [currentMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedHistoryMonth, setSelectedHistoryMonth] = useState(currentMonth);

  const monthlySalary = useMemo(
    () => calculateMonthlySalary(records, config, currentMonth),
    [records, config, currentMonth]
  );

  const historyMonths = useMemo(() => {
    const monthSet = new Set<string>([currentMonth]);
    records.forEach((r) => monthSet.add(r.date.slice(0, 7)));
    return Array.from(monthSet).sort((a, b) => b.localeCompare(a));
  }, [records, currentMonth]);

  const historySalary = useMemo(
    () => calculateMonthlySalary(records, config, selectedHistoryMonth),
    [records, config, selectedHistoryMonth]
  );

  const handleTaxRateChange = (text: string) => {
    const cleanText = text.replace(/[^0-9.]/g, '');
    if (cleanText === '') {
      updateConfig({ taxRate: 0 });
    } else {
      const num = parseFloat(cleanText);
      if (!Number.isNaN(num)) {
        updateConfig({ taxRate: num });
      }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>Ky luong hien tai</Text>
          <Text style={styles.headerTitle}>Thang {currentMonth}</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="filter" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainCanvas}>
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.iconCircle}>
              <Ionicons name="wallet" size={24} color={theme.colors.onPrimary} />
            </View>
            <Text style={styles.heroLabel}>Tong thuc nhan (sau thue)</Text>
          </View>
          <Text style={styles.heroAmount}>{monthlySalary.netSalary.toLocaleString('vi-VN')} ₫</Text>

          <View style={styles.heroBottomRow}>
            <Text style={styles.heroStatus}>Khau tru: -{monthlySalary.taxAmount.toLocaleString('vi-VN')} ₫</Text>
            <TouchableOpacity style={styles.detailBtn} onPress={() => navigation.navigate('StatisticsCompare')}>
              <Text style={styles.detailBtnText}>Chi tiet</Text>
              <Ionicons name="arrow-forward" size={14} color={theme.colors.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.breakdownRow}>
          <View style={styles.breakdownCard}>
            <View style={[styles.smallIconCircle, { backgroundColor: theme.colors.secondaryContainer }]}>
              <Ionicons name="cash-outline" size={16} color={theme.colors.onSecondaryContainer} />
            </View>
            <Text style={styles.breakdownLabel}>Tong luong Gross</Text>
            <Text style={styles.breakdownAmount}>{monthlySalary.totalSalary.toLocaleString('vi-VN')} ₫</Text>
          </View>

          <View style={styles.breakdownCard}>
            <View style={[styles.smallIconCircle, { backgroundColor: theme.colors.tertiaryContainer }]}>
              <Ionicons name="receipt-outline" size={16} color={theme.colors.onTertiaryContainer} />
            </View>
            <Text style={styles.breakdownLabel}>Cai dat Thue (%)</Text>
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Thong ke thoi gian</Text>
        </View>

        <View style={styles.statsContainer}>
          <StatRow styles={styles} icon="calendar-outline" iconColor={theme.colors.primary} label="Tong so ca lam" value={`${monthlySalary.totalDays} ca`} />
          <View style={styles.divider} />
          <StatRow styles={styles} icon="briefcase-outline" iconColor={theme.colors.secondary} label="Tong gio lam co ban" value={`${monthlySalary.totalHours} h`} />
          <View style={styles.divider} />
          <StatRow styles={styles} icon="flash-outline" iconColor={theme.colors.tertiary} label="Tong gio tang ca" value={`${monthlySalary.totalOvertimeHours} h`} />
          <View style={styles.divider} />
          <StatRow styles={styles} icon="moon-outline" iconColor={theme.colors.primary} label="Tong phu cap ca dem" value={`${monthlySalary.totalAllowanceSalary.toLocaleString('vi-VN')} ₫`} />
        </View>

        <View style={styles.sectionHeaderHistory}>
          <Text style={styles.sectionTitle}>Lich su bang luong</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthFilterRow}>
          {historyMonths.map((month) => {
            const selected = selectedHistoryMonth === month;
            return (
              <TouchableOpacity
                key={month}
                style={[styles.monthChip, selected && styles.monthChipActive]}
                onPress={() => setSelectedHistoryMonth(month)}
              >
                <Text style={[styles.monthChipText, selected && styles.monthChipTextActive]}>{month}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Tong quan thang {selectedHistoryMonth}</Text>
          <View style={styles.historyGrid}>
            <HistoryMetric label="Thuc nhan" value={`${historySalary.netSalary.toLocaleString('vi-VN')} ₫`} styles={styles} />
            <HistoryMetric label="Gross" value={`${historySalary.totalSalary.toLocaleString('vi-VN')} ₫`} styles={styles} />
            <HistoryMetric label="So ca" value={`${historySalary.totalDays} ca`} styles={styles} />
            <HistoryMetric label="Tong gio" value={`${(historySalary.totalHours + historySalary.totalOvertimeHours).toFixed(1)} h`} styles={styles} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const StatRow = ({ styles, icon, iconColor, label, value }: any) => (
  <View style={styles.statRow}>
    <View style={styles.statLeft}>
      <View style={[styles.statIconWrapper, { backgroundColor: `${iconColor}1A` }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const HistoryMetric = ({ styles, label, value }: any) => (
  <View style={styles.historyMetric}>
    <Text style={styles.historyMetricLabel}>{label}</Text>
    <Text style={styles.historyMetricValue}>{value}</Text>
  </View>
);

const createStyles = (theme: any) =>
  StyleSheet.create({
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
    sectionHeaderHistory: {
      marginTop: 28,
      marginBottom: 12,
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
    monthFilterRow: {
      gap: 10,
      paddingBottom: 12,
      paddingRight: 12,
    },
    monthChip: {
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: theme.colors.surfaceContainerLowest,
    },
    monthChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    monthChipText: {
      color: theme.colors.onSurface,
      fontWeight: '600',
    },
    monthChipTextActive: {
      color: theme.colors.onPrimary,
    },
    historyCard: {
      backgroundColor: theme.colors.surfaceContainerLow,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      padding: 14,
    },
    historyTitle: {
      color: theme.colors.onSurface,
      fontSize: 15,
      fontWeight: '700',
      marginBottom: 10,
    },
    historyGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    historyMetric: {
      width: '47%',
      backgroundColor: theme.colors.surfaceContainerHighest,
      borderRadius: 12,
      padding: 10,
    },
    historyMetricLabel: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 12,
      marginBottom: 4,
    },
    historyMetricValue: {
      color: theme.colors.onSurface,
      fontSize: 14,
      fontWeight: '700',
    },
  });
