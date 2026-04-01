import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { format, parseISO, subMonths } from 'date-fns';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLegend,
  VictoryLine,
  VictoryPie,
  VictoryStack,
  VictoryTheme,
} from 'victory-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useSalaryStore } from '../store/useSalaryStore';
import { calculateDailySalary, calculateMonthlySalary } from '../utils/salaryCalculator';

const TARGET_MONTH_HOURS = 208;

export default function StatisticsCompareScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const records = useSalaryStore((s) => s.attendance);
  const config = useSalaryStore((s) => s.config);

  const currentMonth = format(new Date(), 'yyyy-MM');
  const monthRecords = useMemo(
    () => records.filter((r) => r.date.startsWith(currentMonth)),
    [records, currentMonth]
  );

  const incomeComposition = useMemo(() => {
    let base = 0;
    let ot = 0;
    let offDay = 0;

    monthRecords.forEach((r) => {
      const daily = calculateDailySalary(r, config);
      base += daily.base;
      ot += daily.ot;
      if (r.shiftType === 'offDay' || r.shiftType === 'offNight') {
        offDay += daily.total;
      }
    });

    const total = base + ot + offDay || 1;
    return [
      { x: 'Luong cung', y: Math.round((base / total) * 100) },
      { x: 'Luong OT', y: Math.round((ot / total) * 100) },
      { x: 'Ngay nghi/le', y: Math.max(0, 100 - Math.round((base / total) * 100) - Math.round((ot / total) * 100)) },
    ];
  }, [monthRecords, config]);

  const incomeTrend = useMemo(() => {
    return Array.from({ length: 6 }, (_, idx) => {
      const month = format(subMonths(new Date(), 5 - idx), 'yyyy-MM');
      const monthly = calculateMonthlySalary(records, config, month);
      return { x: format(parseISO(`${month}-01`), 'MM/yy'), y: monthly.totalSalary };
    });
  }, [records, config]);

  const workIntensity = useMemo(() => {
    const byDay = new Map<string, { normal: number; ot: number }>();
    monthRecords.forEach((r) => {
      const day = r.date.slice(8, 10);
      const old = byDay.get(day) ?? { normal: 0, ot: 0 };
      byDay.set(day, {
        normal: old.normal + r.actualHours,
        ot: old.ot + r.overtimeHours,
      });
    });

    const sorted = Array.from(byDay.entries()).sort((a, b) => Number(a[0]) - Number(b[0])).slice(-7);
    return {
      normal: sorted.map(([d, v]) => ({ x: d, y: v.normal })),
      ot: sorted.map(([d, v]) => ({ x: d, y: v.ot })),
    };
  }, [monthRecords]);

  const progressData = useMemo(() => {
    const currentHours = monthRecords.reduce((sum, r) => sum + r.actualHours + r.overtimeHours, 0);
    const remaining = Math.max(TARGET_MONTH_HOURS - currentHours, 0);
    return {
      currentHours,
      targetHours: TARGET_MONTH_HOURS,
      chartData: [
        { x: 'Da dat', y: currentHours },
        { x: 'Con lai', y: remaining },
      ],
    };
  }, [monthRecords]);

  const salaryVsHours = useMemo(() => {
    return Array.from({ length: 4 }, (_, idx) => {
      const month = format(subMonths(new Date(), 3 - idx), 'yyyy-MM');
      const m = calculateMonthlySalary(records, config, month);
      return {
        label: format(parseISO(`${month}-01`), 'MM'),
        salary: Math.round(m.totalSalary / 1000000),
        hours: Math.round(m.totalHours + m.totalOvertimeHours),
      };
    });
  }, [records, config]);

  const lineColor = theme.colors.primary;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Thong ke & So sanh</Text>

      <ChartCard title="Co cau thu nhap">
        <VictoryPie
          data={incomeComposition}
          innerRadius={80}
          padAngle={2}
          labels={({ datum }: { datum: { x: string; y: number } }) => `${datum.x}: ${datum.y}%`}
          colorScale={['#FFB6C1', '#FFF44F', '#B2F7EF']}
          height={280}
          labelRadius={110}
          style={{ labels: { fill: theme.colors.onSurface, fontSize: 11 } }}
        />
      </ChartCard>

      <ChartCard title="Xu huong thu nhap">
        <VictoryChart theme={VictoryTheme.material} height={240}>
          <VictoryAxis style={{ tickLabels: { fill: theme.colors.onSurfaceVariant, fontSize: 10 } }} />
          <VictoryAxis
            dependentAxis
            style={{ tickLabels: { fill: theme.colors.onSurfaceVariant, fontSize: 10 } }}
          />
          <VictoryLine
            interpolation="natural"
            animate={{ duration: 2000, onLoad: { duration: 1000 } }}
            data={incomeTrend}
            style={{ data: { stroke: lineColor, strokeWidth: 3 } }}
          />
        </VictoryChart>
      </ChartCard>

      <ChartCard title="Cuong do lam viec">
        <VictoryChart domainPadding={20} height={260}>
          <VictoryAxis style={{ tickLabels: { fill: theme.colors.onSurfaceVariant, fontSize: 10 } }} />
          <VictoryAxis dependentAxis style={{ tickLabels: { fill: theme.colors.onSurfaceVariant, fontSize: 10 } }} />
          <VictoryStack>
            <VictoryBar data={workIntensity.normal} style={{ data: { fill: '#FAD0C4' } }} />
            <VictoryBar data={workIntensity.ot} style={{ data: { fill: '#FF9A9E' } }} />
          </VictoryStack>
        </VictoryChart>
      </ChartCard>

      <ChartCard title="Tien do muc tieu thang">
        <VictoryPie
          data={progressData.chartData}
          endAngle={360}
          innerRadius={100}
          labels={() => null}
          colorScale={['#FFB6C1', '#F5F5F5']}
          height={300}
        />
        <Text style={styles.progressText}>
          {progressData.currentHours.toFixed(1)} / {progressData.targetHours} gio
        </Text>
      </ChartCard>

      <ChartCard title="So sanh Luong & Gio lam">
        <VictoryChart domainPadding={{ x: 40 }} height={260}>
          <VictoryAxis style={{ tickLabels: { fill: theme.colors.onSurfaceVariant, fontSize: 10 } }} />
          <VictoryAxis dependentAxis style={{ tickLabels: { fill: theme.colors.onSurfaceVariant, fontSize: 10 } }} />
          <VictoryGroup offset={15} colorScale="qualitative">
            <VictoryBar data={salaryVsHours.map((m) => ({ x: m.label, y: m.salary }))} />
            <VictoryBar data={salaryVsHours.map((m) => ({ x: m.label, y: m.hours }))} />
          </VictoryGroup>
        </VictoryChart>
        <VictoryLegend
          x={20}
          y={0}
          orientation="horizontal"
          gutter={20}
          data={[
            { name: 'Luong (trieu VND)' },
            { name: 'Tong gio lam' },
          ]}
          style={{ labels: { fill: theme.colors.onSurfaceVariant, fontSize: 11 } }}
        />
      </ChartCard>
    </ScrollView>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
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
      paddingBottom: 120,
      gap: 14,
    },
    screenTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.colors.onSurface,
      marginBottom: 6,
    },
    card: {
      backgroundColor: theme.colors.surfaceContainerLow,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      padding: 12,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.onSurface,
      marginBottom: 8,
    },
    progressText: {
      marginTop: -20,
      textAlign: 'center',
      fontWeight: '700',
      color: theme.colors.onSurface,
      marginBottom: 8,
    },
  });
