import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  updateEmail,
  updatePassword,
  updateProfile as updateAuthProfile,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { saveUserProfile } from '../services/userProfileService';
import { syncAsyncStorageToFirebase } from '../services/asyncStorageFirebaseSync';
import { useAppTheme } from '../hooks/useAppTheme';
import { useProfileStore } from '../store/useProfileStore';

export default function PersonalInfoScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const profile = useProfileStore((s) => s.profile);
  const updateProfileStore = useProfileStore((s) => s.updateProfile);

  const [fullName, setFullName] = useState(profile.fullName);
  const [employeeCode, setEmployeeCode] = useState(profile.employeeCode);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(profile.avatarUri);
  const [saving, setSaving] = useState(false);

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Thong bao', 'Can cap quyen truy cap thu vien anh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
      base64: true,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const selected = result.assets[0];
    const localUri = selected.base64 ? `data:image/jpeg;base64,${selected.base64}` : selected.uri;
    setAvatarUri(localUri);
  };

  const handleSave = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Thong bao', 'Ban can dang nhap de cap nhat thong tin.');
      return;
    }

    if (!fullName.trim() || !employeeCode.trim() || !email.trim()) {
      Alert.alert('Thong bao', 'Ho ten, ma nhan vien va email khong duoc de trong.');
      return;
    }

    setSaving(true);

    try {
      const cleanEmail = email.trim();
      const cleanFullName = fullName.trim();
      const cleanEmployeeCode = employeeCode.trim();

      if (cleanEmail !== user.email) {
        await updateEmail(user, cleanEmail);
      }

      if (password.trim()) {
        if (password.trim().length < 6) {
          throw new Error('Mat khau moi phai tu 6 ky tu tro len.');
        }
        await updatePassword(user, password.trim());
      }

      if (cleanFullName !== user.displayName) {
        await updateAuthProfile(user, { displayName: cleanFullName });
      }

      updateProfileStore({
        fullName: cleanFullName,
        employeeCode: cleanEmployeeCode,
        email: cleanEmail,
        avatarUri,
      });

      await saveUserProfile(user.uid, {
        fullName: cleanFullName,
        employeeCode: cleanEmployeeCode,
        email: cleanEmail,
        avatarUri,
      });

      await syncAsyncStorageToFirebase(user.uid, { force: true });
      setPassword('');

      Alert.alert('Thanh cong', 'Da cap nhat thong tin va dong bo Firebase.');
    } catch (error: any) {
      Alert.alert('Cap nhat that bai', error?.message || 'Khong the cap nhat thong tin.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Thong tin ca nhan</Text>

      <View style={styles.avatarWrap}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarPlaceholderText}>Avatar</Text>
          </View>
        )}
        <TouchableOpacity style={styles.secondaryBtn} onPress={pickAvatar}>
          <Text style={styles.secondaryBtnText}>Chon anh dai dien</Text>
        </TouchableOpacity>
      </View>

      <Field label="Ho va ten" value={fullName} onChangeText={setFullName} />
      <Field label="Ma nhan vien" value={employeeCode} onChangeText={setEmployeeCode} />
      <Field
        label="Email dang nhap"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Field
        label="Mat khau moi (bo qua neu khong doi)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveText}>{saving ? 'Dang luu...' : 'Luu thay doi'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({ label, ...props }: { label: string; [key: string]: any }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={theme.colors.outline}
        {...props}
      />
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    content: {
      padding: 16,
      gap: 12,
      paddingBottom: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.onSurface,
      marginBottom: 4,
    },
    avatarWrap: {
      alignItems: 'center',
      gap: 10,
      marginBottom: 6,
    },
    avatar: {
      width: 110,
      height: 110,
      borderRadius: 55,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
    avatarPlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainerLow,
    },
    avatarPlaceholderText: {
      color: theme.colors.onSurfaceVariant,
      fontWeight: '600',
    },
    fieldWrap: {
      gap: 6,
    },
    label: {
      fontSize: 14,
      color: theme.colors.onSurface,
      fontWeight: '600',
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: theme.colors.onSurface,
      backgroundColor: theme.colors.surfaceContainerLow,
    },
    secondaryBtn: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      backgroundColor: theme.colors.surfaceContainerLowest,
    },
    secondaryBtnText: {
      color: theme.colors.onSurface,
      fontWeight: '600',
    },
    saveBtn: {
      marginTop: 8,
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveText: {
      color: theme.colors.onPrimary,
      fontWeight: '700',
      fontSize: 15,
    },
  });
