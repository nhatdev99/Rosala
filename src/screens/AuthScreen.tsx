import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useAuthStore } from '../store/useAuthStore';
import { useSyncStore } from '../store/useSyncStore';

export default function AuthScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const queueAction = useSyncStore((s) => s.queueAction);

  const submit = () => {
    if (!email || !password || (mode === 'register' && !fullName)) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (mode === 'login') {
      const res = login(email, password);
      if (!res.ok) Alert.alert('Đăng nhập thất bại', res.message || 'Có lỗi xảy ra.');
      else queueAction('auth_login', { email, at: new Date().toISOString() });
      return;
    }

    const res = register({
      email,
      password,
      fullName,
      role: 'Nhân viên',
      avatarId: 'avatar_1',
    });

    if (!res.ok) Alert.alert('Đăng ký thất bại', res.message || 'Có lỗi xảy ra.');
    else {
      queueAction('auth_register', { email, fullName, at: new Date().toISOString() });
      Alert.alert('Thành công', 'Tài khoản đã được tạo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rosala</Text>
      <Text style={styles.subtitle}>Đăng nhập / Đăng ký (offline-first, đồng bộ khi có mạng)</Text>

      <View style={styles.switchRow}>
        <TouchableOpacity style={[styles.switchBtn, mode === 'login' && styles.switchBtnActive]} onPress={() => setMode('login')}>
          <Text style={styles.switchText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.switchBtn, mode === 'register' && styles.switchBtnActive]} onPress={() => setMode('register')}>
          <Text style={styles.switchText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>

      {mode === 'register' && (
        <TextInput style={styles.input} placeholder="Họ tên" value={fullName} onChangeText={setFullName} />
      )}
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.submitBtn} onPress={submit}>
        <Text style={styles.submitText}>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 16, justifyContent: 'center' },
    title: { fontSize: 32, fontWeight: '800', color: theme.colors.onSurface, textAlign: 'center' },
    subtitle: { marginTop: 8, marginBottom: 20, textAlign: 'center', color: theme.colors.onSurfaceVariant },
    switchRow: { flexDirection: 'row', marginBottom: 14, gap: 8 },
    switchBtn: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
    },
    switchBtnActive: { backgroundColor: theme.colors.primaryContainer },
    switchText: { color: theme.colors.onSurface, fontWeight: '600' },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 10,
      height: 44,
      paddingHorizontal: 12,
      marginBottom: 10,
      backgroundColor: theme.colors.surface,
      color: theme.colors.onSurface,
    },
    submitBtn: {
      marginTop: 6,
      backgroundColor: theme.colors.primary,
      height: 44,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitText: { color: theme.colors.onPrimary, fontWeight: '700' },
  });
