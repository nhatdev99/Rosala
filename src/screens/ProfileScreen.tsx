import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Area (Background Color) */}
      <View style={styles.headerBackground} />
      
      {/* Profile Info Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB49OM4B0NHwTdtep_cEVpNO9SzkUzZ1DUYBBPUis3IRIdIdJJ2UBfqMwHEFRSgdAzR5gc1wvVnhIBzsgQdfqelck0YTPHVQiTya7G1DOlFEk5Kscleykz32EqEpPiWlhik8jy41e2m3VJbj4FxcfxntHKV2O1V1Oy_Qj9tE4tHbaAB5GvEdKhza_T__bEFmyaWSMB-uPeLidLFTLV2POV8TWlnGCcZaQ79D_546H3d2jCr-33uBGEYqqiE3Jq705XOSwBmI3HywFZQ' }}
            style={styles.avatarImg}
          />
          <TouchableOpacity style={styles.editAvatarBtn}>
            <Ionicons name="pencil" size={16} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>Alice Wonder</Text>
        <Text style={styles.userRole}>Senior Product Designer</Text>
      </View>

      <View style={styles.mainCanvas}>
        {/* Quick Stats */}
        <View style={styles.quickStatsGrid}>
          <View style={styles.statBox}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={24} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={styles.statLabel}>Giờ làm tuần này</Text>
              <Text style={styles.statValue}>38.5h</Text>
            </View>
          </View>
          
          <View style={styles.statBox}>
            <View style={[styles.statIconContainer, { backgroundColor: theme.colors.tertiaryContainer }]}>
              <Ionicons name="calendar" size={24} color={theme.colors.tertiary} />
            </View>
            <View>
              <Text style={styles.statLabel}>Ngày nhận lương</Text>
              <Text style={styles.statValue}>05/11</Text>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="person-outline" title="Thông tin cá nhân" />
            <View style={styles.divider} />
            <MenuItem icon="shield-checkmark-outline" title="Bảo mật & Mật khẩu" />
            <View style={styles.divider} />
            <MenuItem icon="notifications-outline" title="Cài đặt thông báo" />
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Công ty</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="document-text-outline" title="Chính sách & Quy định" />
            <View style={styles.divider} />
            <MenuItem icon="help-circle-outline" title="Hỗ trợ & Góp ý" />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Phiên bản 1.0.0 (Build 2)</Text>
      </View>
    </ScrollView>
  );
}

const MenuItem = ({ icon, title }: any) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={styles.menuItemLeft}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={20} color={theme.colors.onSurfaceVariant} />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={theme.colors.outline} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  contentContainer: {
    paddingBottom: 120, // Tab bar padding
  },
  headerBackground: {
    height: 180,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarImg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: theme.colors.surface,
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.surface,
    elevation: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: theme.typography.headline,
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
  },
  mainCanvas: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.outline,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: 12,
    marginLeft: 8,
  },
  menuCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 64,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.errorContainer,
    padding: 16,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 24,
    gap: 8,
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.outline,
    marginBottom: 16,
  },
});

