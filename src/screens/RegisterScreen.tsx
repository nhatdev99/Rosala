import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile as updateAuthProfile } from 'firebase/auth';
import { auth } from '../services/firebase';
import { saveAuthSession } from '../services/authSession';
import { saveUserProfile } from '../services/userProfileService';
import { useProfileStore } from '../store/useProfileStore';
import { useAppTheme } from '../hooks/useAppTheme';

export default function RegisterScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<any>();
  const updateProfileStore = useProfileStore((s) => s.updateProfile);

  const [fullName, setFullName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const cleanEmail = email.trim();

    if (!fullName.trim() || !employeeCode.trim() || !cleanEmail || !password) {
      Alert.alert('Thong bao', 'Vui long nhap day du thong tin dang ky.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Thong bao', 'Mat khau toi thieu 6 ky tu.');
      return;
    }

    setLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);

      await updateAuthProfile(credential.user, {
        displayName: fullName.trim(),
      });

      await saveUserProfile(credential.user.uid, {
        fullName: fullName.trim(),
        employeeCode: employeeCode.trim(),
        email: cleanEmail,
        avatarUri: null,
      });

      updateProfileStore({
        fullName: fullName.trim(),
        employeeCode: employeeCode.trim(),
        email: cleanEmail,
        avatarUri: null,
      });

      await saveAuthSession({
        email: cleanEmail,
        password,
      });
    } catch (error: any) {
      Alert.alert('Dang ky that bai', error?.message || 'Khong the tao tai khoan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bgTopBlob} />
      <View style={styles.bgBottomBlob} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.topTag}>SIGN UP</Text>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Nhanh gon de bat dau cham cong</Text>

          <TextInput style={styles.input} placeholder="Ho va ten" placeholderTextColor={theme.colors.outline} value={fullName} onChangeText={setFullName} />
          <TextInput style={styles.input} placeholder="Ma nhan vien" placeholderTextColor={theme.colors.outline} value={employeeCode} onChangeText={setEmployeeCode} />
          <TextInput
            style={styles.input}
            placeholder="Email dang nhap"
            placeholderTextColor={theme.colors.outline}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Mat khau"
            placeholderTextColor={theme.colors.outline}
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
            <Text style={styles.primaryButtonText}>{loading ? 'DANG TAO...' : 'SUBMIT'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Da co tai khoan? Quay lai dang nhap</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    bgTopBlob: {
      position: 'absolute',
      width: 290,
      height: 290,
      borderRadius: 150,
      backgroundColor: theme.colors.primary,
      top: -140,
      left: -120,
      opacity: 0.82,
    },
    bgBottomBlob: {
      position: 'absolute',
      width: 290,
      height: 290,
      borderRadius: 150,
      backgroundColor: theme.colors.primaryContainer,
      bottom: -130,
      right: -110,
      opacity: 0.92,
    },
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 24,
      gap: 14,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 28,
      padding: 22,
      gap: 11,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 10 },
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
      fontSize: 30,
      fontWeight: '800',
      color: theme.colors.onSurface,
      fontFamily: theme.typography.headline,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 15,
      paddingHorizontal: 12,
      height: 46,
      color: theme.colors.onSurface,
      backgroundColor: theme.colors.surfaceContainerLow,
      fontWeight: '600',
    },
    primaryButton: {
      alignSelf: 'flex-end',
      marginTop: 8,
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
