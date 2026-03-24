import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useProfileStore } from '../store/useProfileStore';

export default function PersonalInfoScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const profile = useProfileStore(
    (s) => s.profile
  );
  const updateProfile = useProfileStore(
    (s) => s.updateProfile
  );
  const syncFirebase = useProfileStore(
    (s) => s.syncFirebase
  );

  const [fullName, setFullName] = useState(
    profile.fullName
  );
  const [phone, setPhone] = useState(
    profile.phone
  );
  const [email, setEmail] = useState(
    profile.email
  );
  const [department, setDepartment] = useState(
    profile.department
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    updateProfile({
      fullName,
      phone,
      email,
      department,
    });

    const result = await syncFirebase();
    setSaving(false);

    if (result.ok) {
      Alert.alert(
        'Thành công',
        'Đã lưu vào AsyncStorage và đồng bộ Firebase.'
      );
      return;
    }

    if (result.skipped) {
      Alert.alert(
        'Đã lưu cục bộ',
        'Đã lưu AsyncStorage. Firebase chưa cấu hình env.'
      );
      return;
    }

    Alert.alert(
      'Lưu cục bộ thành công',
      `Firebase lỗi: ${result.message}`
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>
        Thông tin cá nhân
      </Text>

      <Field
        label="Họ và tên"
        value={fullName}
        onChangeText={setFullName}
      />
      <Field
        label="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Field
        label="Bộ phận"
        value={department}
        onChangeText={setDepartment}
      />

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveText}>
          {saving
            ? 'Đang lưu...'
            : 'Lưu thay đổi'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({
  label,
  ...props
}: any) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={
          theme.colors.outline
        }
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
      backgroundColor:
        theme.colors.surfaceContainerLow,
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
