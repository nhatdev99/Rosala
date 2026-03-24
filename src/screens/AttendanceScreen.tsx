import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';
import {
  format,
  subDays,
  isAfter,
  startOfDay,
  parseISO,
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSalaryStore } from '../store/useSalaryStore';
import { ShiftType } from '../utils/salaryCalculator';

// Nhãn tiếng Việt cho từng loại ca
const SHIFT_LABELS: Record<
  ShiftType,
  string
> = {
  day: 'Ca ngày',
  night: 'Ca đêm',
  offDay: 'Ngày nghỉ (ngày)',
  offNight: 'Ngày nghỉ (đêm)',
};

export default function AttendanceScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [currentTime, setCurrentTime] =
    useState(new Date());
  const [showDatePicker, setShowDatePicker] =
    useState(false);
  const [showShiftPicker, setShowShiftPicker] =
    useState(false);
  const [selectedDate, setSelectedDate] =
    useState(
      format(new Date(), 'yyyy-MM-dd')
    );

  const attendance = useSalaryStore(
    (s) => s.attendance
  );
  const checkIn = useSalaryStore(
    (s) => s.checkIn
  );
  const checkOut = useSalaryStore(
    (s) => s.checkOut
  );

  // Đồng hồ thời gian thực
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Tìm record hôm nay chưa check-out
  const todayStr = format(
    new Date(),
    'yyyy-MM-dd'
  );
  const activeRecord = useMemo(
    () =>
      attendance.find(
        (r) =>
          r.checkInTime && !r.checkOutTime
      ),
    [attendance]
  );

  // Tạo danh sách 30 ngày gần nhất
  const dateOptions = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const d = subDays(today, i);
      return format(d, 'yyyy-MM-dd');
    });
  }, []);

  // Kiểm tra ngày đã có record chưa
  const hasRecordForDate = (
    date: string
  ) =>
    attendance.some((r) => r.date === date);

  // Xử lý chọn ngày → mở modal chọn ca
  const handleDateSelect = (
    date: string
  ) => {
    if (hasRecordForDate(date)) {
      Alert.alert(
        'Đã tồn tại',
        `Ngày ${date} đã có bản ghi.`
      );
      return;
    }
    setSelectedDate(date);
    setShowDatePicker(false);
    setShowShiftPicker(true);
  };

  // Xử lý chọn ca → check-in
  const handleShiftSelect = (
    shift: ShiftType
  ) => {
    checkIn(selectedDate, shift);
    setShowShiftPicker(false);
    Alert.alert(
      'Check In thành công!',
      `Đã ghi nhận ca "${SHIFT_LABELS[shift]}" cho ngày ${selectedDate}.`
    );
  };

  // Xử lý check-out
  const handleCheckOut = () => {
    if (!activeRecord) return;
    checkOut(activeRecord.id);
    Alert.alert(
      'Check Out thành công!',
      'Đã ghi nhận giờ ra.'
    );
  };

  // Button text & action
  const isCheckedIn = !!activeRecord;

  const handleMainAction = () => {
    if (isCheckedIn) {
      handleCheckOut();
    } else {
      setShowDatePicker(true);
    }
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
        <View style={styles.headerLeft}>
          <View>
            <Text style={styles.welcomeText}>
              CHÀO MỪNG
            </Text>
            <Text style={styles.nameText}>
              Rosala
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationBtn}
        >
          <Ionicons
            name="notifications"
            size={24}
            color={
              theme.colors.primaryContainer
            }
          />
        </TouchableOpacity>
      </View>

      {/* Main Canvas */}
      <View style={styles.mainCanvas}>
        {/* Status Indicator */}
        <View style={styles.statusIndicator}>
          <View
            style={styles.statusDotContainer}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    isCheckedIn
                      ? theme.colors.tertiary
                      : theme.colors.outline,
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.statusText,
              {
                color: isCheckedIn
                  ? theme.colors.tertiary
                  : theme.colors.outline,
              },
            ]}
          >
            {isCheckedIn
              ? `ĐANG LÀM • ${SHIFT_LABELS[activeRecord.shiftType].toUpperCase()}`
              : 'CHƯA CHECK IN'}
          </Text>
        </View>

        {/* Digital Clock */}
        <View style={styles.clockContainer}>
          <View style={styles.timeWrapper}>
            <Text style={styles.timeText}>
              {format(currentTime, 'HH:mm')}
            </Text>
            <Text style={styles.secondsText}>
              :{format(currentTime, 'ss')}
            </Text>
          </View>
          <Text style={styles.dateText}>
            {format(
              currentTime,
              'EEEE, dd/MM/yyyy',
              { locale: vi }
            ).toUpperCase()}
          </Text>
        </View>

        {/* Check In / Check Out Button */}
        <View style={styles.checkInContainer}>
          <View
            style={styles.checkInOuterRing}
          />
          <View
            style={styles.checkInInnerRing}
          />
          <TouchableOpacity
            style={[
              styles.checkInBtn,
              isCheckedIn && {
                backgroundColor:
                  theme.colors.error,
              },
            ]}
            activeOpacity={0.8}
            onPress={handleMainAction}
          >
            <Ionicons
              name={
                isCheckedIn
                  ? 'log-out'
                  : 'log-in'
              }
              size={48}
              color={theme.colors.onPrimary}
              style={{ marginBottom: 8 }}
            />
            <Text
              style={styles.checkInBtnText}
            >
              {isCheckedIn
                ? 'Check Out'
                : 'Check In'}
            </Text>
            {isCheckedIn &&
              activeRecord.checkInTime && (
                <Text
                  style={
                    styles.checkInBtnSub
                  }
                >
                  VÀO LÚC{' '}
                  {format(
                    new Date(
                      activeRecord.checkInTime
                    ),
                    'HH:mm'
                  )}
                </Text>
              )}
          </TouchableOpacity>
        </View>

        {/* Thống kê nhanh hôm nay */}
        <View style={styles.todayStats}>
          <View style={styles.todayStatItem}>
            <Text
              style={styles.todayStatLabel}
            >
              Tổng ca tháng này
            </Text>
            <Text
              style={styles.todayStatValue}
            >
              {
                attendance.filter(
                  (r) =>
                    r.date.startsWith(
                      format(
                        new Date(),
                        'yyyy-MM'
                      )
                    )
                ).length
              }
            </Text>
          </View>
          <View style={styles.todayStatItem}>
            <Text
              style={styles.todayStatLabel}
            >
              Giờ làm hôm nay
            </Text>
            <Text
              style={styles.todayStatValue}
            >
              {attendance
                .filter(
                  (r) => r.date === todayStr
                )
                .reduce(
                  (sum, r) =>
                    sum + r.actualHours,
                  0
                )
                .toFixed(1)}
              h
            </Text>
          </View>
        </View>
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text
                style={styles.modalTitle}
              >
                Chọn ngày Check In
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setShowDatePicker(false)
                }
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={
                    theme.colors.onSurface
                  }
                />
              </TouchableOpacity>
            </View>
            <Text
              style={styles.modalSubtitle}
            >
              Chỉ cho phép chọn ngày hôm nay
              hoặc trước đó
            </Text>
            <ScrollView
              style={styles.dateList}
            >
              {dateOptions.map((date) => {
                const hasRecord =
                  hasRecordForDate(date);
                return (
                  <TouchableOpacity
                    key={date}
                    style={[
                      styles.dateItem,
                      hasRecord &&
                        styles.dateItemDisabled,
                    ]}
                    onPress={() =>
                      handleDateSelect(date)
                    }
                    disabled={hasRecord}
                  >
                    <View
                      style={
                        styles.dateItemLeft
                      }
                    >
                      <Text
                        style={[
                          styles.dateItemDay,
                          hasRecord && {
                            color:
                              theme.colors
                                .outline,
                          },
                        ]}
                      >
                        {format(
                          parseISO(date),
                          'dd'
                        )}
                      </Text>
                      <View>
                        <Text
                          style={
                            styles.dateItemWeekday
                          }
                        >
                          {format(
                            parseISO(date),
                            'EEEE',
                            { locale: vi }
                          )}
                        </Text>
                        <Text
                          style={
                            styles.dateItemFull
                          }
                        >
                          {format(
                            parseISO(date),
                            'dd/MM/yyyy'
                          )}
                        </Text>
                      </View>
                    </View>
                    {hasRecord ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={
                          theme.colors
                            .tertiary
                        }
                      />
                    ) : (
                      <Ionicons
                        name="add-circle-outline"
                        size={20}
                        color={
                          theme.colors
                            .primary
                        }
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Shift Type Picker Modal */}
      <Modal
        visible={showShiftPicker}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { maxHeight: 350 },
            ]}
          >
            <Text style={styles.modalTitle}>
              Chọn loại ca
            </Text>
            <Text
              style={styles.modalSubtitle}
            >
              Ngày {selectedDate}
            </Text>
            {(
              Object.keys(
                SHIFT_LABELS
              ) as ShiftType[]
            ).map((shift) => (
              <TouchableOpacity
                key={shift}
                style={styles.shiftItem}
                onPress={() =>
                  handleShiftSelect(shift)
                }
              >
                <Text
                  style={styles.shiftLabel}
                >
                  {SHIFT_LABELS[shift]}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={
                    theme.colors.outline
                  }
                />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() =>
                setShowShiftPicker(false)
              }
            >
              <Text
                style={styles.cancelBtnText}
              >
                Hủy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor:
      'rgba(255, 255, 255, 0.8)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  welcomeText: {
    fontSize: 10,
    fontFamily: theme.typography.label,
    color: theme.colors.outline,
    letterSpacing: 1,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: theme.typography.headline,
    color: theme.colors.primaryContainer,
  },
  notificationBtn: { padding: 8 },
  mainCanvas: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 24,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor:
      theme.colors.surfaceContainerLow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    marginBottom: 32,
  },
  statusDotContainer: {
    width: 8,
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: theme.typography.label,
    letterSpacing: 0.5,
  },
  clockContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  timeText: {
    fontSize: 60,
    fontWeight: '800',
    fontFamily: theme.typography.headline,
    color: theme.colors.onSurface,
    letterSpacing: -2,
  },
  secondsText: {
    fontSize: 60,
    fontWeight: '800',
    fontFamily: theme.typography.headline,
    color: theme.colors.primaryContainer,
    letterSpacing: -2,
  },
  dateText: {
    fontSize: 14,
    fontFamily: theme.typography.label,
    color: theme.colors.outline,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  checkInContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  checkInOuterRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 125,
    borderWidth: 1,
    borderColor:
      'rgba(0, 91, 191, 0.1)',
  },
  checkInInnerRing: {
    position: 'absolute',
    width: '85%',
    height: '85%',
    borderRadius: 125,
    borderWidth: 1,
    borderColor:
      'rgba(0, 91, 191, 0.05)',
  },
  checkInBtn: {
    width: '75%',
    height: '75%',
    borderRadius: 125,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
  },
  checkInBtnText: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: theme.typography.headline,
    color: theme.colors.onPrimary,
    letterSpacing: -0.5,
  },
  checkInBtnSub: {
    fontSize: 10,
    fontFamily: theme.typography.label,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    marginTop: 4,
  },
  todayStats: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  todayStatItem: {
    flex: 1,
    backgroundColor:
      theme.colors.surfaceContainerLowest,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  todayStatLabel: {
    fontSize: 12,
    color: theme.colors.outline,
    marginBottom: 4,
  },
  todayStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: theme.colors.outline,
    marginBottom: 16,
  },
  dateList: { maxHeight: 400 },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor:
      'rgba(0,0,0,0.05)',
  },
  dateItemDisabled: { opacity: 0.5 },
  dateItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateItemDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    width: 36,
    textAlign: 'center',
  },
  dateItemWeekday: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  dateItemFull: {
    fontSize: 12,
    color: theme.colors.outline,
  },
  shiftItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor:
      'rgba(0,0,0,0.05)',
  },
  shiftLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  cancelBtn: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor:
      theme.colors.surfaceContainerHigh,
    borderRadius: 12,
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
  },
});

