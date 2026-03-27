import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useThemeStore,
  ThemeMode,
  ThemePaletteName,
} from '../store/useThemeStore';
import {
  pastelPalettes,
} from '../utils/theme';
import { useAppTheme } from '../hooks/useAppTheme';

const modeOptions: {
  label: string;
  value: ThemeMode;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { label: 'Theo hệ thống', value: 'system', icon: 'phone-portrait-outline' },
  { label: 'Sáng', value: 'light', icon: 'sunny-outline' },
  { label: 'Tối', value: 'dark', icon: 'moon-outline' },
];

const paletteLabels: Record<ThemePaletteName, string> = {
  pastel_pink_soft: 'Pastel Hồng Dịu',
  pastel_blue_calm: 'Pastel Xanh Êm',
  pastel_green_mint: 'Pastel Mint',
  pastel_purple_dream: 'Pastel Tím Mộng',
  pastel_yellow_soft: 'Pastel Vàng Nhẹ',
  pastel_peach: 'Pastel Peach',
  pastel_mix_cute: 'Pastel Mix Cute',
  pastel_gray_black: 'Xám Đen',
};

export default function ThemeSettingsScreen() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const palette = useThemeStore((s) => s.palette);
  const setPalette = useThemeStore((s) => s.setPalette);
  const theme = useAppTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.surface }]}> 
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>Cài đặt giao diện</Text>

      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Chế độ hiển thị</Text>
      <View style={[styles.card, { backgroundColor: theme.colors.surfaceContainerLow }]}> 
        {modeOptions.map((item, idx) => {
          const active = item.value === mode;
          return (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.row,
                idx < modeOptions.length - 1 && {
                  borderBottomColor: theme.colors.outlineVariant,
                  borderBottomWidth: 1,
                },
              ]}
              onPress={() => setMode(item.value)}
            >
              <View style={styles.left}>
                <Ionicons name={item.icon} size={20} color={theme.colors.onSurfaceVariant} />
                <Text style={[styles.label, { color: theme.colors.onSurface }]}>{item.label}</Text>
              </View>
              <Ionicons
                name={active ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={active ? theme.colors.primary : theme.colors.outline}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Bảng màu</Text>
      <View style={[styles.paletteList, { backgroundColor: theme.colors.surfaceContainerLow }]}> 
        {(Object.keys(pastelPalettes) as ThemePaletteName[]).map((key, idx, arr) => {
          const p = pastelPalettes[key];
          const active = key === palette;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.paletteRow,
                idx < arr.length - 1 && {
                  borderBottomColor: theme.colors.outlineVariant,
                  borderBottomWidth: 1,
                },
              ]}
              onPress={() => setPalette(key)}
            >
              <View style={styles.paletteLeft}>
                <View style={styles.swatches}>
                  <View style={[styles.swatch, { backgroundColor: p.primary }]} />
                  <View style={[styles.swatch, { backgroundColor: p.secondary }]} />
                  <View style={[styles.swatch, { backgroundColor: p.accent }]} />
                </View>
                <Text style={[styles.paletteName, { color: theme.colors.onSurface }]}>{paletteLabels[key]}</Text>
              </View>
              <Ionicons
                name={active ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={active ? theme.colors.primary : theme.colors.outline}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
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
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 10,
  },
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
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
  paletteList: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 24,
  },
  paletteRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paletteLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  swatches: {
    flexDirection: 'row',
    gap: 4,
  },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffffff55',
  },
  paletteName: {
    fontSize: 14,
    fontWeight: '600',
  },
});
