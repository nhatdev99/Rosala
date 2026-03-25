import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  subMonths,
  addMonths,
  isAfter,
  startOfDay,
  parseISO,
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSalaryStore } from '../store/useSalaryStore';

const SHIFT_LABELS: Record<string, string> = {
  day: 'Ca ngay',
  night: 'Ca dem',
  offDay: 'Nghi (ngay)',
  offNight: 'Nghi (dem)',
};

export default function LogsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const attendance = useSalaryStore((s) => s.attendance);
  const deleteRecord = useSalaryStore((s) => s.deleteRecord);
  const checkIn = useSalaryStore((s) => s.checkIn);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = startOfDay(new Date());

  const canGoNext = !isAfter(startOfMonth(addMonths(currentMonth, 1)), today);

  const handlePrevMonth = () => setCurrentMonth((m) => subMonths(m, 1));
  const handleNextMonth = () => {
    if (canGoNext) setCurrentMonth((m) => addMonths(m, 1));
  };

  const handleDeleteRecord = (id: string) => {
    Alert.alert(
      'Xoa ban ghi',
      'Ban co chac muon xoa ban ghi cham cong nay khong?',
      [
        { text: 'Huy', style: 'cancel' },
        {
          text: 'Xoa',
          style: 'destructive',
          onPress: () => deleteRecord(id),
        },
      ]
    );
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  });

  const startPadding = (getDay(monthStart) + 6) % 7;

  const recordDates = useMemo(() => {
    const set = new Set<string>();
    attendance.forEach((r) => set.add(r.date));
    return set;
  }, [attendance]);

  const monthStr = format(currentMonth, 'yyyy-MM');
  const monthlyLogs = useMemo(
    () =>
      attendance
        .filter((r) => r.date.startsWith(monthStr))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [attendance, monthStr]
  );

  const handleQuickCheckIn = () => {
    if (!selectedDate) {
      Alert.alert('Thong bao', 'Hay chon ngay tren lich.');
      return;
    }

    if (recordDates.has(selectedDate)) {
      Alert.alert('Da co du lieu', 'Ngay nay da co ban ghi cham cong.');
      return;
    }

    Alert.alert('Check-in nhanh', 'Chon loai ca', [
      { text: SHIFT_LABELS.day, onPress: () => checkIn(selectedDate, 'day') },
      { text: SHIFT_LABELS.night, onPress: () => checkIn(selectedDate, 'night') },
      { text: SHIFT_LABELS.offDay, onPress: () => checkIn(selectedDate, 'offDay') },
      { text: SHIFT_LABELS.offNight, onPress: () => checkIn(selectedDate, 'offNight') },
      { text: 'Huy', style: 'cancel' },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.calendarSubtitle}>KY HIEN TAI</Text>
          <Text style={styles.calendarTitle}>
            {format(currentMonth, 'MMMM yyyy', { locale: vi })}
          </Text>
        </View>
        <View style={styles.chevronGroup}>
          <TouchableOpacity style={styles.chevronBtn} onPress={handlePrevMonth}>
            <Ionicons name="chevron-back" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chevronBtn, !canGoNext && { opacity: 0.3 }]}
            onPress={handleNextMonth}
            disabled={!canGoNext}
          >
            <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainCanvas}>
        <View style={styles.calendarGrid}>
          <View style={styles.weekDays}>
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
              <Text key={d} style={styles.weekDayText}>
                {d}
              </Text>
            ))}
          </View>
          <View style={styles.daysGrid}>
            {Array.from({ length: startPadding }).map((_, i) => (
              <View key={`pad-${i}`} style={styles.dayCell} />
            ))}

            {daysInMonth.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isToday = dateStr === format(today, 'yyyy-MM-dd');
              const hasRecord = recordDates.has(dateStr);
              const isFuture = isAfter(startOfDay(day), today);
              const isSelected = selectedDate === dateStr;

              return (
                <TouchableOpacity
                  key={dateStr}
                  style={[
                    styles.dayCell,
                    isToday && styles.currentDayCell,
                    isSelected && styles.selectedDayCell,
                  ]}
                  onPress={() => {
                    if (isFuture) return;
                    setSelectedDate(dateStr);
                  }}
                  disabled={isFuture}
                >
                  <Text
                    style={[
                      isFuture ? styles.inactiveDayText : styles.activeDayText,
                      isToday && styles.currentDayText,
                      isSelected && styles.selectedDayText,
                    ]}
                  >
                    {format(day, 'd')}
                  </Text>
                  {hasRecord && (
                    <View
                      style={[
                        styles.dayDot,
                        isToday && { backgroundColor: theme.colors.onPrimary },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.quickCheckinBar}>
          <View>
            <Text style={styles.quickLabel}>Ngay da chon</Text>
            <Text style={styles.quickDate}>
              {selectedDate ? format(parseISO(selectedDate), 'dd/MM/yyyy') : '--/--/----'}
            </Text>
          </View>
          <TouchableOpacity style={styles.quickBtn} onPress={handleQuickCheckIn}>
            <Ionicons name="log-in-outline" size={18} color={theme.colors.onPrimary} />
            <Text style={styles.quickBtnText}>Check-in nhanh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logsSection}>
          <View style={styles.logsHeader}>
            <Text style={styles.logsTitle}>Lich su cham cong</Text>
            <Text style={styles.logCount}>{monthlyLogs.length} ban ghi</Text>
          </View>

          {monthlyLogs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={theme.colors.outline} />
              <Text style={styles.emptyText}>Chua co du lieu thang nay</Text>
            </View>
          ) : (
            <View style={styles.logsList}>
              {monthlyLogs.map((record) => {
                const dateObj = parseISO(record.date);
                const totalH = record.actualHours + record.overtimeHours;
                const hours = Math.floor(totalH);
                const mins = Math.round((totalH - hours) * 60);
                const checkedOut = !!record.checkOutTime;

                return (
                  <View key={record.id} style={styles.logCard}>
                    <View style={styles.logCardTop}>
                      <View style={styles.logCardTopLeft}>
                        <View style={styles.dateCircle}>
                          <Text style={styles.monthText}>
                            {format(dateObj, 'MMM', { locale: vi }).toUpperCase()}
                          </Text>
                          <Text style={styles.dateText}>{format(dateObj, 'dd')}</Text>
                        </View>
                        <View style={styles.dayInfo}>
                          <Text style={styles.dayName}>
                            {format(dateObj, 'EEEE', { locale: vi })}
                          </Text>
                          <View style={styles.hoursRow}>
                            <View
                              style={[
                                styles.hoursDot,
                                {
                                  backgroundColor: checkedOut
                                    ? theme.colors.tertiary
                                    : theme.colors.secondary,
                                },
                              ]}
                            />
                            <Text style={styles.hoursText}>
                              {checkedOut ? `${hours}h ${mins}m` : 'Dang lam...'}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: checkedOut
                              ? theme.colors.tertiaryContainer
                              : theme.colors.secondaryContainer,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            {
                              color: checkedOut
                                ? theme.colors.onTertiaryContainer
                                : theme.colors.onSecondaryContainer,
                            },
                          ]}
                        >
                          {checkedOut ? SHIFT_LABELS[record.shiftType] : 'DANG LAM'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDeleteRecord(record.id)}
                      >
                        <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.logCardBottom}>
                      <View style={styles.timeBlock}>
                        <Text style={styles.timeLabel}>CHECK IN</Text>
                        <View style={styles.timeValueRow}>
                          <Ionicons name="log-in" size={16} color={theme.colors.primary} />
                          <Text style={styles.timeValueText}>
                            {record.checkInTime
                              ? format(new Date(record.checkInTime), 'HH:mm')
                              : '--:--'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.timeBlock}>
                        <Text style={styles.timeLabel}>CHECK OUT</Text>
                        <View style={styles.timeValueRow}>
                          <Ionicons name="log-out" size={16} color={theme.colors.error} />
                          <Text style={styles.timeValueText}>
                            {record.checkOutTime
                              ? format(new Date(record.checkOutTime), 'HH:mm')
                              : '--:--'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

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
      alignItems: 'flex-end',
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    calendarSubtitle: {
      fontSize: 10,
      fontFamily: theme.typography.label,
      color: theme.colors.outline,
      letterSpacing: 1,
      marginBottom: 4,
    },
    calendarTitle: {
      fontSize: 28,
      fontWeight: '800',
      fontFamily: theme.typography.headline,
      color: theme.colors.onSurface,
      letterSpacing: -0.5,
      textTransform: 'capitalize',
    },
    chevronGroup: {
      flexDirection: 'row',
      gap: 8,
    },
    chevronBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceContainerHigh,
      borderRadius: 8,
    },
    mainCanvas: {
      paddingHorizontal: 24,
      marginTop: 16,
    },
    calendarGrid: {
      backgroundColor: theme.colors.surfaceContainerLow,
      borderRadius: 12,
      padding: 16,
      marginBottom: 32,
    },
    weekDays: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    weekDayText: {
      flex: 1,
      textAlign: 'center',
      fontSize: 10,
      fontWeight: '700',
      color: theme.colors.outline,
      letterSpacing: -0.5,
    },
    daysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayCell: {
      width: '14.28%',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedDayCell: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 8,
    },
    inactiveDayText: {
      color: theme.colors.outline,
      opacity: 0.3,
      fontSize: 14,
    },
    activeDayText: {
      color: theme.colors.onSurface,
      fontSize: 14,
    },
    currentDayCell: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
    },
    currentDayText: {
      color: theme.colors.onPrimary,
      fontSize: 14,
      fontWeight: 'bold',
    },
    selectedDayText: {
      color: theme.colors.primary,
      fontWeight: '700',
    },
    dayDot: {
      position: 'absolute',
      bottom: 4,
      width: 4,
      height: 4,
      backgroundColor: theme.colors.tertiary,
      borderRadius: 2,
    },
    logsSection: { marginBottom: 24 },
    quickCheckinBar: {
      marginTop: -16,
      marginBottom: 24,
      padding: 16,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceContainerLow,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    quickLabel: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.colors.outline,
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    quickDate: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.onSurface,
    },
    quickBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 14,
      height: 40,
      borderRadius: 10,
    },
    quickBtnText: {
      color: theme.colors.onPrimary,
      fontWeight: '700',
      fontSize: 13,
    },
    logsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    logsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      fontFamily: theme.typography.headline,
      color: theme.colors.onSurface,
    },
    logCount: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 48,
      gap: 12,
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.outline,
    },
    logsList: { gap: 16 },
    logCard: {
      backgroundColor: theme.colors.surfaceContainerLowest,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.05)',
      marginBottom: 16,
    },
    logCardTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    logCardTopLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    dateCircle: {
      width: 48,
      height: 48,
      backgroundColor: theme.colors.surfaceContainerHigh,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    monthText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: theme.colors.outline,
      lineHeight: 12,
    },
    dateText: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.colors.onSurface,
      lineHeight: 20,
    },
    dayInfo: { justifyContent: 'center' },
    dayName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.onSurface,
      textTransform: 'capitalize',
    },
    hoursRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 2,
    },
    hoursDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 6,
    },
    hoursText: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.onSurfaceVariant,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusBadgeText: {
      fontSize: 10,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    deleteBtn: {
      marginLeft: 10,
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.errorContainer,
    },
    logCardBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: 'rgba(0,0,0,0.05)',
    },
    timeBlock: { flex: 1 },
    timeLabel: {
      fontSize: 10,
      fontWeight: 'bold',
      color: theme.colors.outline,
      letterSpacing: -0.5,
      marginBottom: 4,
    },
    timeValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    timeValueText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginLeft: 8,
    },
  });
