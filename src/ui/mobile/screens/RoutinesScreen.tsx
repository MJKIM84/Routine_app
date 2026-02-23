import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeLayout } from '@ui/shared/layouts/SafeLayout';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { Typography } from '@ui/shared/components/Typography';
import { Button } from '@ui/shared/components/Button';
import {
  RoutineFormModal,
  TemplatePickerModal,
  RoutineCard,
} from '@ui/mobile/components/routine';
import type { RoutineFormData } from '@ui/mobile/components/routine';
import { useRoutineStore } from '@core/stores/routineStore';
import { useBloomStore } from '@core/stores/bloomStore';
import {
  groupByTimeSlot,
  TIME_SLOT_ORDER,
  getTimeSlotLabel,
  getTimeSlotIcon,
  getTodayKey,
} from '@core/utils/routine';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { haptics } from '@platform/haptics';
import type { RoutineData } from '@core/types';
import type { RoutineTemplate } from '@core/data/routineTemplates';

export function RoutinesScreen() {
  const colors = useThemeColors();
  const rawRoutines = useRoutineStore((s) => s.routines);
  const rawLogs = useRoutineStore((s) => s.logs);
  const addRoutine = useRoutineStore((s) => s.addRoutine);
  const deleteRoutine = useRoutineStore((s) => s.deleteRoutine);
  const completeRoutineFn = useRoutineStore((s) => s.completeRoutine);
  const uncompleteRoutine = useRoutineStore((s) => s.uncompleteRoutine);
  const bloomComplete = useBloomStore((s) => s.completeRoutine);

  const routines = useMemo(
    () => rawRoutines.filter((r) => r.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
    [rawRoutines],
  );

  const completedSet = useMemo(() => {
    const today = getTodayKey();
    return new Set(rawLogs.filter((l) => l.dateKey === today).map((l) => l.routineId));
  }, [rawLogs]);

  const [showForm, setShowForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<RoutineData | undefined>();

  const groups = useMemo(() => groupByTimeSlot(routines), [routines]);

  const handleAddPress = useCallback(() => {
    setShowTemplates(true);
  }, []);

  const handleCustomAdd = useCallback(() => {
    setShowTemplates(false);
    setEditingRoutine(undefined);
    setShowForm(true);
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

  const handleToggle = useCallback(
    (id: string) => {
      haptics.light();
      if (completedSet.has(id)) {
        uncompleteRoutine(id);
      } else {
        completeRoutineFn(id);
        bloomComplete();
      }
    },
    [completedSet, completeRoutineFn, uncompleteRoutine, bloomComplete],
  );

  const handleLongPress = useCallback(
    (routine: RoutineData) => {
      haptics.warning();
      // Simple confirm delete for now
      if (typeof window !== 'undefined' && window.confirm) {
        if (window.confirm(`"${routine.title}" 루틴을 삭제할까요?`)) {
          deleteRoutine(routine.id);
        }
      } else {
        Alert.alert(
          '루틴 삭제',
          `"${routine.title}" 루틴을 삭제할까요?`,
          [
            { text: '취소', style: 'cancel' },
            {
              text: '삭제',
              style: 'destructive',
              onPress: () => deleteRoutine(routine.id),
            },
          ],
        );
      }
    },
    [deleteRoutine],
  );

  const hasRoutines = routines.length > 0;

  return (
    <SafeLayout>
      <View style={styles.header}>
        <Typography variant="h2">루틴</Typography>
        {hasRoutines && (
          <TouchableOpacity
            onPress={handleAddPress}
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
          >
            <Typography variant="body" color="inverse">
              + 추가
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {!hasRoutines ? (
          <GlassCard style={styles.emptyCard}>
            <View style={styles.emptyState}>
              <Typography variant="h1" style={{ textAlign: 'center' }}>
                ✨
              </Typography>
              <Typography variant="h3" style={{ textAlign: 'center', marginTop: spacing.md }}>
                첫 루틴을 만들어보세요
              </Typography>
              <Typography
                variant="body"
                color="secondary"
                style={{ textAlign: 'center', marginTop: spacing.sm }}
              >
                건강한 습관의 시작은 작은 루틴부터입니다
              </Typography>
              <View style={styles.buttonRow}>
                <Button
                  title="📋 추천 템플릿"
                  onPress={() => setShowTemplates(true)}
                  style={{ flex: 1, marginRight: spacing.sm }}
                />
                <Button
                  title="✏️ 직접 만들기"
                  variant="outline"
                  onPress={() => setShowForm(true)}
                  style={{ flex: 1, marginLeft: spacing.sm }}
                />
              </View>
            </View>
          </GlassCard>
        ) : (
          <>
            {/* Grouped routines */}
            {TIME_SLOT_ORDER.map((slot) => {
              const slotRoutines = groups[slot];
              if (slotRoutines.length === 0) return null;

              return (
                <View key={slot} style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Typography variant="body" style={{ fontWeight: '600' }}>
                      {getTimeSlotIcon(slot)} {getTimeSlotLabel(slot)}
                    </Typography>
                    <Typography variant="caption" color="tertiary">
                      {slotRoutines.filter((r) => completedSet.has(r.id)).length}/{slotRoutines.length}
                    </Typography>
                  </View>
                  {slotRoutines.map((routine) => (
                    <RoutineCard
                      key={routine.id}
                      routine={routine}
                      isCompleted={completedSet.has(routine.id)}
                      onToggleComplete={handleToggle}
                      onLongPress={handleLongPress}
                    />
                  ))}
                </View>
              );
            })}

            {/* Quick add from templates */}
            <TouchableOpacity
              onPress={handleAddPress}
              style={[styles.quickAdd, { borderColor: colors.cardBorder }]}
              activeOpacity={0.7}
            >
              <Typography variant="body" color="secondary">
                + 루틴 추가하기
              </Typography>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <RoutineFormModal
        visible={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingRoutine(undefined);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingRoutine}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  addBtn: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  emptyCard: {
    marginTop: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    width: '100%',
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickAdd: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
});
