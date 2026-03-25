import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile as updateAuthProfile } from 'firebase/auth';
import { auth } from '../services/firebase';
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
    } catch (error: any) {
      Alert.alert('Dang ky that bai', error?.message || 'Khong the tao tai khoan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Dang ky tai khoan</Text>

      <TextInput style={styles.input} placeholder="Ho va ten" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder="Ma nhan vien" value={employeeCode} onChangeText={setEmployeeCode} />
      <TextInput
        style={styles.input}
        placeholder="Email dang nhap"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mat khau dang nhap"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
        <Text style={styles.primaryButtonText}>{loading ? 'Dang tao tai khoan...' : 'Dang ky'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Da co tai khoan? Quay lai dang nhap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    content: {
      padding: 24,
      gap: 12,
      justifyContent: 'center',
      flexGrow: 1,
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      color: theme.colors.onSurface,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: theme.colors.onSurface,
      backgroundColor: theme.colors.surfaceContainerLow,
    },
    primaryButton: {
      height: 46,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      marginTop: 6,
    },
    primaryButtonText: {
      color: theme.colors.onPrimary,
      fontWeight: '700',
    },
    linkText: {
      textAlign: 'center',
      color: theme.colors.primary,
      fontWeight: '600',
      marginTop: 8,
    },
  });
