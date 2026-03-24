import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';

export default function LogsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB49OM4B0NHwTdtep_cEVpNO9SzkUzZ1DUYBBPUis3IRIdIdJJ2UBfqMwHEFRSgdAzR5gc1wvVnhIBzsgQdfqelck0YTPHVQiTya7G1DOlFEk5Kscleykz32EqEpPiWlhik8jy41e2m3VJbj4FxcfxntHKV2O1V1Oy_Qj9tE4tHbaAB5GvEdKhza_T__bEFmyaWSMB-uPeLidLFTLV2POV8TWlnGCcZaQ79D_546H3d2jCr-33uBGEYqqiE3Jq705XOSwBmI3HywFZQ' }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.appNameText}>PreciseAnchor</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications" size={24} color={theme.colors.outline} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainCanvas}>
        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <View>
              <Text style={styles.calendarSubtitle}>CURRENT PERIOD</Text>
              <Text style={styles.calendarTitle}>October 2023</Text>
            </View>
            <View style={styles.chevronGroup}>
              <TouchableOpacity style={styles.chevronBtn}>
                <Ionicons name="chevron-back" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.chevronBtn}>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Calendar Grid (Simplified View) */}
          <View style={styles.calendarGrid}>
            <View style={styles.weekDays}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <Text key={day} style={styles.weekDayText}>{day.toUpperCase()}</Text>
              ))}
            </View>
            <View style={styles.daysGrid}>
              {/* Only rendering one active week for demonstration */}
              {[25, 26, 27, 28, 29, 30].map(day => (
                <View key={`prev-${day}`} style={styles.dayCell}>
                  <Text style={styles.inactiveDayText}>{day}</Text>
                </View>
              ))}
              {[1, 2, 3, 4].map(day => (
                <View key={day} style={styles.dayCell}>
                  <Text style={styles.activeDayText}>{day}</Text>
                </View>
              ))}
              <View style={[styles.dayCell, styles.currentDayCell]}>
                <Text style={styles.currentDayText}>5</Text>
                <View style={styles.currentDayDot} />
              </View>
              {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(day => (
                <View key={day} style={styles.dayCell}>
                  <Text style={styles.activeDayText}>{day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Daily Logs */}
        <View style={styles.logsSection}>
          <View style={styles.logsHeader}>
            <Text style={styles.logsTitle}>Daily Logs</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.logsList}>
            <LogCard 
              date="05" 
              month="Oct" 
              dayName="Thursday" 
              totalHours="8h 15m Total" 
              tagColor={theme.colors.tertiary}
              status="APPROVED"
              statusBg={theme.colors.tertiaryContainer}
              statusColor={theme.colors.onTertiaryContainer}
              checkIn="08:45 AM"
              checkOut="05:00 PM"
            />
            <LogCard 
              date="04" 
              month="Oct" 
              dayName="Wednesday" 
              totalHours="7h 45m Total" 
              tagColor={theme.colors.secondary}
              status="PENDING"
              statusBg={theme.colors.secondaryContainer}
              statusColor={theme.colors.onSecondaryContainer}
              checkIn="09:15 AM"
              checkOut="05:00 PM"
            />
            <LogCard 
              date="03" 
              month="Oct" 
              dayName="Tuesday" 
              totalHours="9h 00m Total" 
              tagColor={theme.colors.tertiary}
              status="APPROVED"
              statusBg={theme.colors.tertiaryContainer}
              statusColor={theme.colors.onTertiaryContainer}
              checkIn="08:30 AM"
              checkOut="05:30 PM"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const LogCard = ({ date, month, dayName, totalHours, tagColor, status, statusBg, statusColor, checkIn, checkOut }: any) => (
  <View style={styles.logCard}>
    <View style={styles.logCardTop}>
      <View style={styles.logCardTopLeft}>
        <View style={styles.dateCircle}>
          <Text style={styles.monthText}>{month.toUpperCase()}</Text>
          <Text style={styles.dateText}>{date}</Text>
        </View>
        <View style={styles.dayInfo}>
          <Text style={styles.dayName}>{dayName}</Text>
          <View style={styles.hoursRow}>
            <View style={[styles.hoursDot, { backgroundColor: tagColor }]} />
            <Text style={styles.hoursText}>{totalHours}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
        <Text style={[styles.statusBadgeText, { color: statusColor }]}>{status}</Text>
      </View>
    </View>
    
    <View style={styles.logCardBottom}>
      <View style={styles.timeBlock}>
        <Text style={styles.timeLabel}>CHECK IN</Text>
        <View style={styles.timeValueRow}>
          <Ionicons name="log-in" size={16} color={theme.colors.primary} />
          <Text style={styles.timeValueText}>{checkIn}</Text>
        </View>
      </View>
      <View style={styles.timeBlock}>
        <Text style={styles.timeLabel}>CHECK OUT</Text>
        <View style={styles.timeValueRow}>
          <Ionicons name="log-out" size={16} color={theme.colors.error} />
          <Text style={styles.timeValueText}>{checkOut}</Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  contentContainer: {
    paddingBottom: 120, // space for bottom tab
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: theme.colors.primaryFixed,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  appNameText: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: theme.typography.headline,
    color: theme.colors.onSecondaryFixedVariant,
    letterSpacing: -0.5,
  },
  notificationBtn: {
    padding: 8,
  },
  mainCanvas: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  calendarSection: {
    marginBottom: 40,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
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
  calendarGrid: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 16,
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
  currentDayDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    backgroundColor: theme.colors.onPrimary,
    borderRadius: 2,
  },
  logsSection: {
    marginBottom: 24,
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
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  logsList: {
    flexDirection: 'col',
    gap: 16, // Assuming gap is supported or we will add margin
  },
  logCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: 16, // Fallback for lack of gap on old versions
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
  dayInfo: {
    justifyContent: 'center',
  },
  dayName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
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
  logCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  timeBlock: {
    flex: 1,
  },
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
