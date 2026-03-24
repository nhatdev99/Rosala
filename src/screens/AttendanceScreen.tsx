import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';
import { format } from 'date-fns';

export default function AttendanceScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXCCv4Oj-lZGnJBdCeNEl0NwPbQrnKYYhaHOm9vf1Swi4wpQjC8x33AG9sSLidkbua0r5X-LPPeAlQ54AYvFlY6d3wf9Yo-AeCq3XImNoQ9lg40TV8dBy31CfpuPvT4PT8yEaCWp6DdxGIp9N1-Df5RlcNX9FW7dxqsLaJLCQ6QjQTad5xMgu9daSeN_VWlTk-lZOAmfQExZbpKHGDfpWmtgYoto1OF4DnrtGNufV5TMN9aOWkXH_on59vxjkN9SZC2HCmKWPVEoJc' }}
              style={styles.avatar}
            />
          </View>
          <View>
            <Text style={styles.welcomeText}>WELCOME BACK</Text>
            <Text style={styles.nameText}>Good morning, John!</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications" size={24} color={theme.colors.primaryContainer} />
        </TouchableOpacity>
      </View>

      {/* Main Canvas */}
      <View style={styles.mainCanvas}>
        {/* Status Indicator */}
        <View style={styles.statusIndicator}>
          <View style={styles.statusDotContainer}>
            <View style={[styles.statusDot, { position: 'absolute', opacity: 0.3, transform: [{ scale: 1.5 }] }]} />
            <View style={styles.statusDot} />
          </View>
          <Text style={styles.statusText}>ACTIVE SHIFT PENDING</Text>
        </View>

        {/* Digital Clock */}
        <View style={styles.clockContainer}>
          <View style={styles.timeWrapper}>
            <Text style={styles.timeText}>{format(currentTime, 'HH:mm')}</Text>
            <Text style={styles.secondsText}>:{format(currentTime, 'ss')}</Text>
          </View>
          <Text style={styles.dateText}>{format(currentTime, 'EEEE, MMM dd, yyyy').toUpperCase()}</Text>
        </View>

        {/* Check In Button */}
        <View style={styles.checkInContainer}>
          <View style={styles.checkInOuterRing} />
          <View style={styles.checkInInnerRing} />
          <TouchableOpacity style={styles.checkInBtn} activeOpacity={0.8}>
            <Ionicons name="log-in" size={48} color={theme.colors.onPrimary} style={{ marginBottom: 8 }} />
            <Text style={styles.checkInBtnText}>Check In</Text>
            <Text style={styles.checkInBtnSub}>HQ OFFICE • FLOOR 4</Text>
          </TouchableOpacity>
        </View>

        {/* Location Bento Card */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <View style={styles.locationHeaderLeft}>
              <Ionicons name="location" size={20} color={theme.colors.primary} />
              <Text style={styles.locationTitle}>Work Location</Text>
            </View>
            <View style={styles.inZoneBadge}>
              <Text style={styles.inZoneText}>In Zone</Text>
            </View>
          </View>
          
          <View style={styles.mapContainer}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFM6pz6hglfkjGIOOs8NhlWByxsk82HAfMW67WUk7k_wXkJDXplff3Dh5aVbwTz1tnxbncfxTMEsolwUn5w6tRLHW-4EKe8Gm9w56MWy6p86SzPv5E67RvTzH8_zIIX_rrW_1BAIHD2JbYt8i8npVZcxK0jIm-Nd5JuB-tma_NGF_MEH428ZuOokEqA6ro4O2bIbL_mxeM37MUZKHPlnJS5Fvf-z0UE6oZMpwAIuCks4dnGS_6dLwYM1OglHpu9Gpcc2tqQSZIAxRv' }}
              style={styles.mapImage}
            />
            <View style={styles.mapOverlay} />
            <View style={styles.mapPinContainer}>
              <View style={[styles.mapPin, { position: 'absolute', opacity: 0.3, transform: [{ scale: 2 }] }]} />
              <View style={styles.mapPin} />
            </View>
          </View>

          <View style={styles.locationFooter}>
            <View>
              <Text style={styles.addressLine1}>101 California St.</Text>
              <Text style={styles.addressLine2}>San Francisco, CA 94111</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewMapText}>View Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

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
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: 10,
    fontFamily: theme.typography.label,
    color: theme.colors.outline,
    letterSpacing: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: theme.typography.headline,
    color: theme.colors.primaryContainer,
  },
  notificationBtn: {
    padding: 8,
  },
  mainCanvas: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 24,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surfaceContainerLow,
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
    backgroundColor: theme.colors.tertiary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: theme.typography.label,
    color: theme.colors.tertiary,
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
    borderColor: 'rgba(0, 91, 191, 0.1)',
  },
  checkInInnerRing: {
    position: 'absolute',
    width: '85%',
    height: '85%',
    borderRadius: 125,
    borderWidth: 1,
    borderColor: 'rgba(0, 91, 191, 0.05)',
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
  locationCard: {
    width: '100%',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#191c23',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: theme.typography.headline,
    color: theme.colors.onSurface,
  },
  inZoneBadge: {
    backgroundColor: 'rgba(55, 134, 58, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  inZoneText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: theme.typography.label,
    color: theme.colors.tertiaryContainer,
  },
  mapContainer: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  mapPinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -8 }, { translateY: -8 }],
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: '#fff',
  },
  locationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 12,
  },
  addressLine1: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
  },
  addressLine2: {
    fontSize: 10,
    color: theme.colors.outline,
    marginTop: 2,
  },
  viewMapText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: theme.typography.headline,
    color: theme.colors.primary,
  },
});
