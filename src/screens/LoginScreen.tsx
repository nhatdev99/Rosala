import React, { useMemo, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../services/firebase';
import { useAppTheme } from '../hooks/useAppTheme';

export default function LoginScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      Alert.alert('Thong bao', 'Vui long nhap email va mat khau.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
    } catch (error: any) {
      Alert.alert('Dang nhap that bai', error?.message || 'Khong the dang nhap.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bgTopBlob} />
      <View style={styles.bgBottomBlob} />

      <View style={styles.card}>
        <Text style={styles.topTag}>LOGIN</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Please enter your password</Text>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.colors.outline}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          {!!email.trim() && <Ionicons name="checkmark" size={18} color={theme.colors.tertiary} />}
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.colors.outline}
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.footerRow}>
          <View style={styles.socialRow}>
            <View style={styles.socialIcon}><Ionicons name="logo-facebook" size={16} color={theme.colors.outline} /></View>
            <View style={styles.socialIcon}><Ionicons name="logo-twitter" size={16} color={theme.colors.outline} /></View>
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
            <Text style={styles.primaryButtonText}>{loading ? 'DANG NHAP...' : 'LOGIN'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Chua co tai khoan? Dang ky</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 24,
      backgroundColor: theme.colors.background,
      gap: 16,
    },
    bgTopBlob: {
      position: 'absolute',
      width: 280,
      height: 280,
      borderRadius: 160,
      backgroundColor: theme.colors.primary,
      top: -130,
      left: -120,
      opacity: 0.85,
    },
    bgBottomBlob: {
      position: 'absolute',
      width: 260,
      height: 260,
      borderRadius: 140,
      backgroundColor: theme.colors.primaryContainer,
      bottom: -110,
      right: -110,
      opacity: 0.9,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 28,
      padding: 22,
      gap: 10,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 22,
      elevation: 8,
    },
    topTag: {
      color: theme.colors.primary,
      fontFamily: theme.typography.label,
      letterSpacing: 1.5,
      fontWeight: '700',
      marginBottom: 6,
    },
    title: {
      fontSize: 34,
      fontWeight: '800',
      color: theme.colors.onSurface,
      fontFamily: theme.typography.headline,
      marginTop: 4,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 6,
    },
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      backgroundColor: theme.colors.surfaceContainerLow,
      paddingHorizontal: 14,
    },
    input: {
      flex: 1,
      height: 46,
      color: theme.colors.onSurface,
      fontWeight: '600',
    },
    footerRow: {
      marginTop: 14,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    socialRow: {
      flexDirection: 'row',
      gap: 10,
    },
    socialIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.surfaceContainerHigh,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButton: {
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 26,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.28,
      shadowRadius: 14,
      elevation: 6,
    },
    primaryButtonText: {
      color: theme.colors.onPrimary,
      fontWeight: '800',
      letterSpacing: 1,
      fontSize: 12,
    },
    linkText: {
      textAlign: 'center',
      color: theme.colors.primary,
      fontWeight: '700',
      marginTop: 4,
    },
  });
