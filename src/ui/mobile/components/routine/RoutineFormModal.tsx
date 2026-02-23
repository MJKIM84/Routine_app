import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Typography } from '@ui/shared/components/Typography';
import { Button } from '@ui/shared/components/Button';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { getCategoryLabel, getCategoryIcon, getTimeSlotLabel, getTimeSlotIcon, ROUTINE_COLORS, getDefaultColorForCategory } from '@core/utils/routine';
import type { RoutineCategory, TimeSlot, FrequencyType, RoutineData } from '@core/types';
import { haptics } from '@platform/haptics';

interface RoutineFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: RoutineFormData) => void;
  initialData?: RoutineData;
}

export interface RoutineFormData {
  title: string;
  description?: string;
  icon: string;
  color: string;
  category: RoutineCategory;
  timeSlot: TimeSlot;
  scheduledTime?: string;
  frequencyType: FrequencyType;
  frequencyValue: string;
  durationMinutes?: number;
  reminderEnabled: boolean;
  reminderMinutesBefore: number;
}

const CATEGORIES: RoutineCategory[] = [
  'exercise', 'meditation', 'diet', 'water', 'sleep', 'skincare', 'journal', 'custom',
];

const TIME_SLOTS: TimeSlot[] = ['morning', 'afternoon', 'evening', 'night'];

const DURATION_OPTIONS = [1, 5, 10, 15, 20, 30, 45, 60];

export function RoutineFormModal({
  visible,
  onClose,
  onSubmit,
  initialData,
}: RoutineFormModalProps) {
  const colors = useThemeColors();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [category, setCategory] = useState<RoutineCategory>(initialData?.category ?? 'custom');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>(initialData?.timeSlot ?? 'morning');
  const [color, setColor] = useState(initialData?.color ?? '#1A6B3C');
  const [durationMinutes, setDurationMinutes] = useState<number>(initialData?.durationMinutes ?? 10);
  const [icon, setIcon] = useState(initialData?.icon ?? '⚡');

  const handleCategorySelect = useCallback((cat: RoutineCategory) => {
    haptics.light();
    setCategory(cat);
    setIcon(getCategoryIcon(cat));
    setColor(getDefaultColorForCategory(cat));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!title.trim()) return;
    haptics.success();

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      icon,
      color,
      category,
      timeSlot,
      frequencyType: 'daily',
      frequencyValue: '1',
      durationMinutes,
      reminderEnabled: false,
      reminderMinutesBefore: 10,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('custom');
    setTimeSlot('morning');
    setColor('#1A6B3C');
    setDurationMinutes(10);
    setIcon('⚡');
    onClose();
  }, [title, description, icon, color, category, timeSlot, durationMinutes, onSubmit, onClose]);

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Typography variant="body" color="accent">
                취소
              </Typography>
            </TouchableOpacity>
            <Typography variant="h3">
              {isEditing ? '루틴 수정' : '새 루틴'}
            </Typography>
            <TouchableOpacity onPress={handleSubmit} disabled={!title.trim()}>
              <Typography
                variant="body"
                color="accent"
                style={{ opacity: title.trim() ? 1 : 0.4 }}
              >
                {isEditing ? '수정' : '추가'}
              </Typography>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Title input */}
            <View style={styles.field}>
              <Typography variant="caption" color="secondary" style={styles.fieldLabel}>
                루틴 이름
              </Typography>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="예: 아침 스트레칭"
                placeholderTextColor={colors.textTertiary}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.cardBorder,
                  },
                ]}
                maxLength={50}
              />
            </View>

            {/* Description */}
            <View style={styles.field}>
              <Typography variant="caption" color="secondary" style={styles.fieldLabel}>
                설명 (선택)
              </Typography>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="루틴에 대한 간단한 설명"
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={2}
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.cardBorder,
                  },
                ]}
                maxLength={200}
              />
            </View>

            {/* Category */}
            <View style={styles.field}>
              <Typography variant="caption" color="secondary" style={styles.fieldLabel}>
                카테고리
              </Typography>
              <View style={styles.chipRow}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => handleCategorySelect(cat)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: category === cat ? getDefaultColorForCategory(cat) + '20' : colors.card,
                        borderColor: category === cat ? getDefaultColorForCategory(cat) : colors.cardBorder,
                      },
                    ]}
                  >
                    <Typography variant="caption">
                      {getCategoryIcon(cat)} {getCategoryLabel(cat)}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Time Slot */}
            <View style={styles.field}>
              <Typography variant="caption" color="secondary" style={styles.fieldLabel}>
                시간대
              </Typography>
              <View style={styles.chipRow}>
                {TIME_SLOTS.map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    onPress={() => {
                      haptics.light();
                      setTimeSlot(slot);
                    }}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: timeSlot === slot ? colors.primary + '20' : colors.card,
                        borderColor: timeSlot === slot ? colors.primary : colors.cardBorder,
                      },
                    ]}
                  >
                    <Typography variant="caption">
                      {getTimeSlotIcon(slot)} {getTimeSlotLabel(slot)}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Duration */}
            <View style={styles.field}>
              <Typography variant="caption" color="secondary" style={styles.fieldLabel}>
                소요 시간
              </Typography>
              <View style={styles.chipRow}>
                {DURATION_OPTIONS.map((dur) => (
                  <TouchableOpacity
                    key={dur}
                    onPress={() => {
                      haptics.light();
                      setDurationMinutes(dur);
                    }}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: durationMinutes === dur ? colors.primary + '20' : colors.card,
                        borderColor: durationMinutes === dur ? colors.primary : colors.cardBorder,
                      },
                    ]}
                  >
                    <Typography variant="caption">
                      {dur}분
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Color */}
            <View style={styles.field}>
              <Typography variant="caption" color="secondary" style={styles.fieldLabel}>
                색상
              </Typography>
              <View style={styles.colorRow}>
                {ROUTINE_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => {
                      haptics.light();
                      setColor(c);
                    }}
                    style={[
                      styles.colorDot,
                      { backgroundColor: c },
                      color === c && styles.colorDotSelected,
                    ]}
                  />
                ))}
              </View>
            </View>

            <View style={{ height: 60 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '90%',
    paddingTop: spacing.base,
    paddingHorizontal: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.base,
  },
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
  field: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontSize: 16,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
