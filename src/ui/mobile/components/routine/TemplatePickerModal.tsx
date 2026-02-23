import React, { useCallback } from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '@ui/shared/components/Typography';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { ROUTINE_TEMPLATES, type RoutineTemplate } from '@core/data/routineTemplates';
import { getTimeSlotLabel, getTimeSlotIcon } from '@core/utils/routine';
import { haptics } from '@platform/haptics';
import type { TimeSlot } from '@core/types';

interface TemplatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (template: RoutineTemplate) => void;
}

const SLOT_ORDER: TimeSlot[] = ['morning', 'afternoon', 'evening', 'night'];

export function TemplatePickerModal({
  visible,
  onClose,
  onSelect,
}: TemplatePickerModalProps) {
  const colors = useThemeColors();

  const handleSelect = useCallback(
    (template: RoutineTemplate) => {
      haptics.light();
      onSelect(template);
      onClose();
    },
    [onSelect, onClose],
  );

  const grouped = SLOT_ORDER.reduce(
    (acc, slot) => {
      acc[slot] = ROUTINE_TEMPLATES.filter((t) => t.timeSlot === slot);
      return acc;
    },
    {} as Record<TimeSlot, RoutineTemplate[]>,
  );

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Typography variant="h3">추천 루틴 템플릿</Typography>
            <TouchableOpacity onPress={onClose}>
              <Typography variant="body" color="accent">
                닫기
              </Typography>
            </TouchableOpacity>
          </View>

          <Typography
            variant="caption"
            color="secondary"
            style={styles.subtitle}
          >
            원하는 루틴을 선택하면 바로 추가돼요
          </Typography>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {SLOT_ORDER.map((slot) => {
              const templates = grouped[slot];
              if (templates.length === 0) return null;

              return (
                <View key={slot} style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Typography variant="body">
                      {getTimeSlotIcon(slot)} {getTimeSlotLabel(slot)}
                    </Typography>
                  </View>
                  {templates.map((template) => (
                    <TouchableOpacity
                      key={template.id}
                      onPress={() => handleSelect(template)}
                      style={[
                        styles.templateCard,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.cardBorder,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.templateIcon, { backgroundColor: template.color + '20' }]}>
                        <Typography variant="h3">{template.icon}</Typography>
                      </View>
                      <View style={styles.templateContent}>
                        <Typography variant="body" style={{ fontWeight: '600' }}>
                          {template.title}
                        </Typography>
                        <Typography variant="caption" color="secondary" numberOfLines={1}>
                          {template.description}
                        </Typography>
                      </View>
                      <View style={styles.templateMeta}>
                        <Typography variant="caption" color="tertiary">
                          {template.durationMinutes}분
                        </Typography>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingTop: spacing.base,
    paddingHorizontal: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  templateIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  templateContent: {
    flex: 1,
  },
  templateMeta: {
    marginLeft: spacing.sm,
  },
});
