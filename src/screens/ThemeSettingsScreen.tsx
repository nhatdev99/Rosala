import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore, ThemeMode } from '../store/useThemeStore';
import { useAppTheme } from '../hooks/useAppTheme';

const options: {
  label: string;
  value: ThemeMode;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { label: 'Theo hệ thống', value: 'system', icon: 'phone-portrait-outline' },
  { label: 'Sáng', value: 'light', icon: 'sunny-outline' },
  { label: 'Tối', value: 'dark', icon: 'moon-outline' },
];

export default function ThemeSettingsScreen() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}> 
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>Cài đặt giao diện</Text>
      <Text style={[styles.desc, { color: theme.colors.onSurfaceVariant }]}>Chọn giao diện cho ứng dụng.</Text>

      <View style={[styles.card, { backgroundColor: theme.colors.surfaceContainerLow }]}> 
        {options.map((item, idx) => {
          const active = item.value === mode;
          return (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.row,
                idx < options.length - 1 && {
                  borderBottomColor: theme.colors.outlineVariant,
                  borderBottomWidth: 1,
                },
              ]}
              onPress={() => setMode(item.value)}
            >
              <View style={styles.left}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text style={[styles.label, { color: theme.colors.onSurface }]}> 
                  {item.label}
                </Text>
              </View>
              {active ? (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={theme.colors.primary}
                />
              ) : (
                <Ionicons
                  name="ellipse-outline"
                  size={22}
                  color={theme.colors.outline}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    marginBottom: 16,
  },
  card: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});
