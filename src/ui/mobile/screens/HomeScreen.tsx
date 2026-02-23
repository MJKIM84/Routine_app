import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeLayout } from '@ui/shared/layouts/SafeLayout';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { Typography } from '@ui/shared/components/Typography';
import { BloomView } from '@ui/mobile/components/bloom';
import { DailyRoutineList, RoutineFormModal, TemplatePickerModal } from '@ui/mobile/components/routine';
import type { RoutineFormData } from '@ui/mobile/components/routine';
import { useRoutineStore } from '@core/stores/routineStore';
import { getTodayKey } from '@core/utils/routine';
import { useThemeColors } from '@theme/index';
import { spacing } from '@theme/spacing';
import type { RoutineTemplate } from '@core/data/routineTemplates';

export function HomeScreen() {
  const colors = useThemeColors();
  const addRoutine = useRoutineStore((s) => s.addRoutine);
  const rawRoutines = useRoutineStore((s) => s.routines);
  const rawLogs = useRoutineStore((s) => s.logs);

  const activeRoutines = useMemo(
    () => rawRoutines.filter((r) => r.isActive),
    [rawRoutines],
  );

  const completedCount = useMemo(() => {
    const today = getTodayKey();
    const set = new Set(rawLogs.filter((l) => l.dateKey === today).map((l) => l.routineId));
    return activeRoutines.filter((r) => set.has(r.id)).length;
  }, [activeRoutines, rawLogs]);
  const total = activeRoutines.length;

  const [showForm, setShowForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleAddRoutine = useCallback(() => {
    setShowTemplates(true);
  }, []);

  const handleFormSubmit = useCallback(
    (data: RoutineFormData) => {
      addRoutine(data);
    },
    [addRoutine],
  );

  const handleTemplateSelect = useCallback(
    (template: RoutineTemplate) => {
      addRoutine({
        title: template.title,
        description: template.description,
        icon: template.icon,
        color: template.color,
        category: template.category,
        timeSlot: template.timeSlot,
        frequencyType: template.frequencyType,
        frequencyValue: template.frequencyValue,
        durationMinutes: template.durationMinutes,
        reminderEnabled: false,
        reminderMinutesBefore: 10,
        isFromTemplate: true,
        templateId: template.id,
      });
    },
    [addRoutine],
  );

  return (
    <SafeLayout>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Typography variant="h2">RoutineFlow</Typography>
          <Typography variant="body" color="secondary">
            오늘도 좋은 습관을 만들어봐요
          </Typography>
        </View>

        <BloomView />

        <View style={styles.section}>
          <DailyRoutineList onAddRoutine={handleAddRoutine} />
        </View>

        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            스트릭
          </Typography>
          <GlassCard>
            <View style={styles.streakRow}>
              <View style={styles.streakItem}>
                <Typography variant="h1" style={{ color: colors.primary, textAlign: 'center' }}>
                  {completedCount}
                </Typography>
                <Typography variant="caption" color="secondary" style={{ textAlign: 'center' }}>
                  오늘 완료
                </Typography>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <Typography variant="h1" style={{ color: colors.accent, textAlign: 'center' }}>
                  {total}
                </Typography>
                <Typography variant="caption" color="secondary" style={{ textAlign: 'center' }}>
                  전체 루틴
                </Typography>
              </View>
            </View>
          </GlassCard>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <RoutineFormModal
        visible={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
      />

      <TemplatePickerModal
        visible={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelect={handleTemplateSelect}
      />
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  header: {
    paddingVertical: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
