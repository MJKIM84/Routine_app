import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { Typography } from '@ui/shared/components/Typography';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import {
  getCategoryLabel,
  getCategoryIcon,
  getTimeSlotLabel,
  getTimeSlotIcon,
  ROUTINE_COLORS,
  getDefaultColorForCategory,
} from '@core/utils/routine';
import type { RoutineCategory, TimeSlot, FrequencyType, RoutineData, RepeatType } from '@core/types';
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
  repeatType?: RepeatType;
  repeatIntervalDays?: number;
}

const CATEGORIES: RoutineCategory[] = [
  'exercise', 'meditation', 'diet', 'water', 'sleep', 'skincare', 'journal', 'custom',
];

const TIME_SLOTS: TimeSlot[] = ['morning', 'afternoon', 'evening', 'night'];
const DURATION_OPTIONS = [1, 3, 5, 10, 15, 20, 30, 45, 60, 90];
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);
const MINUTE_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
const REMINDER_OPTIONS = [
  { label: '정시', value: 0 },
  { label: '5분 전', value: 5 },
  { label: '10분 전', value: 10 },
  { label: '15분 전', value: 15 },
  { label: '30분 전', value: 30 },
];

const WEEKDAYS = [
  { key: 'mon', label: '월' },
  { key: 'tue', label: '화' },
  { key: 'wed', label: '수' },
  { key: 'thu', label: '목' },
  { key: 'fri', label: '금' },
  { key: 'sat', label: '토' },
  { key: 'sun', label: '일' },
];

const REPEAT_OPTIONS: { key: RepeatType; label: string }[] = [
  { key: 'daily', label: '매일' },
  { key: 'weekdays', label: '평일' },
  { key: 'weekends', label: '주말' },
  { key: 'specific_days', label: '요일 선택' },
  { key: 'once', label: '일회성' },
  { key: 'interval', label: '간격 반복' },
];

export function RoutineFormModal({
  visible,
  onClose,
  onSubmit,
  initialData,
}: RoutineFormModalProps) {
  const colors = useThemeColors();
  const isEditing = !!initialData;

  // Basic fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RoutineCategory>('custom');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('morning');
  const [color, setColor] = useState('#1A6B3C');
  const [icon, setIcon] = useState('⚡');
  const [durationMinutes, setDurationMinutes] = useState<number>(10);

  // Schedule fields
  const [scheduleHour, setScheduleHour] = useState(7);
  const [scheduleMinute, setScheduleMinute] = useState(0);
  const [hasScheduledTime, setHasScheduledTime] = useState(false);

  // Repeat fields
  const [repeatType, setRepeatType] = useState<RepeatType>('daily');
  const [selectedDays, setSelectedDays] = useState<string[]>(['mon', 'tue', 'wed', 'thu', 'fri']);
  const [intervalDays, setIntervalDays] = useState(2);

  // Alarm fields
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState(0);

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description ?? '');
        setCategory(initialData.category);
        setTimeSlot(initialData.timeSlot);
        setColor(initialData.color);
        setIcon(initialData.icon);
        setDurationMinutes(initialData.durationMinutes ?? 10);
        setReminderEnabled(initialData.reminderEnabled);
        setReminderMinutesBefore(initialData.reminderMinutesBefore);
        setRepeatType(initialData.repeatType ?? 'daily');
        setIntervalDays(initialData.repeatIntervalDays ?? 2);

        if (initialData.scheduledTime) {
          setHasScheduledTime(true);
          const [h, m] = initialData.scheduledTime.split(':').map(Number);
          setScheduleHour(h);
          setScheduleMinute(m);
        } else {
          setHasScheduledTime(false);
        }

        if (initialData.frequencyType === 'specific_days' && initialData.frequencyValue) {
          setSelectedDays(initialData.frequencyValue.split(','));
        }
      } else {
        setTitle('');
        setDescription('');
        setCategory('custom');
        setTimeSlot('morning');
        setColor('#1A6B3C');
        setIcon('⚡');
        setDurationMinutes(10);
        setHasScheduledTime(false);
        setScheduleHour(7);
        setScheduleMinute(0);
        setRepeatType('daily');
        setSelectedDays(['mon', 'tue', 'wed', 'thu', 'fri']);
        setIntervalDays(2);
        setReminderEnabled(false);
        setReminderMinutesBefore(0);
      }
    }
  }, [visible, initialData]);

  const handleCategorySelect = useCallback((cat: RoutineCategory) => {
    haptics.light();
    setCategory(cat);
    setIcon(getCategoryIcon(cat));
    setColor(getDefaultColorForCategory(cat));
  }, []);

  const toggleDay = useCallback((day: string) => {
    haptics.light();
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }, []);

  const getFrequencyType = (): FrequencyType => {
    if (repeatType === 'specific_days' || repeatType === 'weekdays' || repeatType === 'weekends') {
      return 'specific_days';
    }
    return 'daily';
  };

  const getFrequencyValue = (): string => {
    switch (repeatType) {
      case 'weekdays': return 'mon,tue,wed,thu,fri';
      case 'weekends': return 'sat,sun';
      case 'specific_days': return selectedDays.join(',');
      default: return '1';
    }
  };

  const handleSubmit = useCallback(() => {
    if (!title.trim()) return;
    haptics.success();

    const scheduledTime = hasScheduledTime
      ? `${String(scheduleHour).padStart(2, '0')}:${String(scheduleMinute).padStart(2, '0')}`
      : undefined;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      icon,
      color,
      category,
      timeSlot,
      scheduledTime,
      frequencyType: getFrequencyType(),
      frequencyValue: getFrequencyValue(),
      durationMinutes,
      reminderEnabled: hasScheduledTime && reminderEnabled,
      reminderMinutesBefore,
      repeatType,
      repeatIntervalDays: repeatType === 'interval' ? intervalDays : undefined,
    });
    onClose();
  }, [
    title, description, icon, color, category, timeSlot,
    hasScheduledTime, scheduleHour, scheduleMinute,
    durationMinutes, reminderEnabled, reminderMinutesBefore,
    repeatType, selectedDays, intervalDays, onSubmit, onClose,
  ]);

  const timeDisplay = `${String(scheduleHour).padStart(2, '0')}:${String(scheduleMinute).padStart(2, '0')}`;

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
              <Typography variant="body" color="accent">취소</Typography>
            </TouchableOpacity>
            <Typography variant="h3">{isEditing ? '루틴 수정' : '새 루틴'}</Typography>
            <TouchableOpacity onPress={handleSubmit} disabled={!title.trim()}>
              <Typography variant="body" color="accent" style={{ opacity: title.trim() ? 1 : 0.4 }}>
                {isEditing ? '수정' : '추가'}
              </Typography>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* ── Title ── */}
            <View style={styles.field}>
              <Typography variant="caption" color="secondary" style={styles.fieldLabel}>루틴 이름 *</Typography>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="예: 아침 스트레칭"
                placeholderTextColor={colors.textTertiary}
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.cardBorder }]}
                maxLength={50}
              />
            </View>

            {/* ── Description ── */}
            <View style={styles.field}>
              <Typography variant="caption" color="secondary" style={styles.fieldLabel}>설명 (선택)</Typography>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="루틴에 대한 간단한 설명"
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={2}
                style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.cardBorder }]}
                maxLength={200}
              />
            </View>

            {/* ── Category ── */}
            <View style={styles.field}>
              <Typography variant="caption" color="secondary" style={styles.fieldLabel}>카테고리</Typography>
              <View style={styles.chipRow}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => handleCategorySelect(cat)}
                    style={[styles.chip, {
                      backgroundColor: category === cat ? getDefaultColorForCategory(cat) + '20' : colors.card,
                      borderColor: category === cat ? getDefaultColorForCategory(cat) : colors.cardBorder,
                    }]}
                  >
                    <Typography variant="caption">
                      {getCategoryIcon(cat)} {getCategoryLabel(cat)}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ── Time Slot ── */}
            <View style={styles.field}>
              <Typography variant="caption" color="secondary" style={styles.fieldLabel}>시간대</Typography>
              <View style={styles.chipRow}>
                {TIME_SLOTS.map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    onPress={() => { haptics.light(); setTimeSlot(slot); }}
                    style={[styles.chip, {
                      backgroundColor: timeSlot === slot ? colors.primary + '20' : colors.card,
                      borderColor: timeSlot === slot ? colors.primary : colors.cardBorder,
                    }]}
                  >
                    <Typography variant="caption">{getTimeSlotIcon(slot)} {getTimeSlotLabel(slot)}</Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ═══ SCHEDULED TIME ═══ */}
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <View style={styles.sectionRow}>
                <Typography variant="body" style={{ fontWeight: '600' }}>⏰ 실행 시간 설정</Typography>
                <Switch
                  value={hasScheduledTime}
                  onValueChange={(v) => { haptics.light(); setHasScheduledTime(v); }}
                  trackColor={{ false: colors.cardBorder, true: colors.primary + '60' }}
                  thumbColor={hasScheduledTime ? colors.primary : '#ccc'}
                />
              </View>

              {hasScheduledTime && (
                <>
                  {/* Time Picker (hour / minute scroll) */}
                  <View style={styles.timePickerRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
                      {HOUR_OPTIONS.map(h => (
                        <TouchableOpacity
                          key={`h_${h}`}
                          onPress={() => { haptics.light(); setScheduleHour(h); }}
                          style={[styles.timeChip, scheduleHour === h && { backgroundColor: colors.primary }]}
                        >
                          <Typography
                            variant="body"
                            style={[
                              styles.timeChipText,
                              scheduleHour === h && { color: '#fff', fontWeight: '700' },
                            ]}
                          >
                            {String(h).padStart(2, '0')}
                          </Typography>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <Typography variant="h3" style={{ marginHorizontal: 4 }}>:</Typography>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
                      {MINUTE_OPTIONS.map(m => (
                        <TouchableOpacity
                          key={`m_${m}`}
                          onPress={() => { haptics.light(); setScheduleMinute(m); }}
                          style={[styles.timeChip, scheduleMinute === m && { backgroundColor: colors.primary }]}
                        >
                          <Typography
                            variant="body"
                            style={[
                              styles.timeChipText,
                              scheduleMinute === m && { color: '#fff', fontWeight: '700' },
                            ]}
                          >
                            {String(m).padStart(2, '0')}
                          </Typography>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.timeDisplay}>
                    <Typography variant="h2" style={{ color: colors.primary, fontWeight: '700' }}>
                      {timeDisplay}
                    </Typography>
                  </View>
                </>
              )}
            </View>

            {/* ═══ REPEAT TYPE ═══ */}
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Typography variant="body" style={{ fontWeight: '600', marginBottom: spacing.sm }}>
                🔁 반복 설정
              </Typography>
              <View style={styles.chipRow}>
                {REPEAT_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => { haptics.light(); setRepeatType(opt.key); }}
                    style={[styles.chip, {
                      backgroundColor: repeatType === opt.key ? colors.primary + '20' : colors.background,
                      borderColor: repeatType === opt.key ? colors.primary : colors.cardBorder,
                    }]}
                  >
                    <Typography variant="caption" style={repeatType === opt.key ? { fontWeight: '600' } : undefined}>
                      {opt.label}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Specific days selector */}
              {repeatType === 'specific_days' && (
                <View style={[styles.chipRow, { marginTop: spacing.md }]}>
                  {WEEKDAYS.map(day => (
                    <TouchableOpacity
                      key={day.key}
                      onPress={() => toggleDay(day.key)}
                      style={[styles.dayChip, {
                        backgroundColor: selectedDays.includes(day.key) ? colors.primary : colors.background,
                        borderColor: selectedDays.includes(day.key) ? colors.primary : colors.cardBorder,
                      }]}
                    >
                      <Typography
                        variant="caption"
                        style={{
                          color: selectedDays.includes(day.key) ? '#fff' : colors.text,
                          fontWeight: '600',
                        }}
                      >
                        {day.label}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Interval setting */}
              {repeatType === 'interval' && (
                <View style={[styles.intervalRow, { marginTop: spacing.md }]}>
                  <Typography variant="body">매</Typography>
                  <View style={styles.chipRow}>
                    {[2, 3, 4, 5, 7, 14].map(n => (
                      <TouchableOpacity
                        key={n}
                        onPress={() => { haptics.light(); setIntervalDays(n); }}
                        style={[styles.chip, {
                          backgroundColor: intervalDays === n ? colors.primary + '20' : colors.background,
                          borderColor: intervalDays === n ? colors.primary : colors.cardBorder,
                        }]}
                      >
                        <Typography variant="caption">{n}일</Typography>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Typography variant="body">마다</Typography>
                </View>
              )}
            </View>

            {/* ═══ DURATION (Timer) ═══ */}
            <View style={styles.field}>
              <Typography variant="caption" color="secondary" style={styles.fieldLabel}>
                ⏱️ 소요 시간 (타이머)
              </Typography>
              <View style={styles.chipRow}>
                {DURATION_OPTIONS.map((dur) => (
                  <TouchableOpacity
                    key={dur}
                    onPress={() => { haptics.light(); setDurationMinutes(dur); }}
                    style={[styles.chip, {
                      backgroundColor: durationMinutes === dur ? colors.primary + '20' : colors.card,
                      borderColor: durationMinutes === dur ? colors.primary : colors.cardBorder,
                    }]}
                  >
                    <Typography variant="caption">{dur}분</Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ═══ ALARM ═══ */}
            {hasScheduledTime && (
              <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <View style={styles.sectionRow}>
                  <Typography variant="body" style={{ fontWeight: '600' }}>🔔 알림</Typography>
                  <Switch
                    value={reminderEnabled}
                    onValueChange={(v) => { haptics.light(); setReminderEnabled(v); }}
                    trackColor={{ false: colors.cardBorder, true: colors.primary + '60' }}
                    thumbColor={reminderEnabled ? colors.primary : '#ccc'}
                  />
                </View>
                {reminderEnabled && (
                  <View style={[styles.chipRow, { marginTop: spacing.sm }]}>
                    {REMINDER_OPTIONS.map(opt => (
                      <TouchableOpacity
                        key={opt.value}
                        onPress={() => { haptics.light(); setReminderMinutesBefore(opt.value); }}
                        style={[styles.chip, {
                          backgroundColor: reminderMinutesBefore === opt.value ? colors.primary + '20' : colors.background,
                          borderColor: reminderMinutesBefore === opt.value ? colors.primary : colors.cardBorder,
                        }]}
                      >
                        <Typography variant="caption">{opt.label}</Typography>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* ── Color ── */}
            <View style={styles.field}>
              <Typography variant="caption" color="secondary" style={styles.fieldLabel}>색상</Typography>
              <View style={styles.colorRow}>
                {ROUTINE_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => { haptics.light(); setColor(c); }}
                    style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotSelected]}
                  />
                ))}
              </View>
            </View>

            <View style={{ height: 80 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingTop: spacing.base,
    paddingHorizontal: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.base,
  },
  scrollContent: { paddingBottom: spacing['3xl'] },
  field: { marginBottom: spacing.lg },
  fieldLabel: { marginBottom: spacing.sm },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontSize: 16,
  },
  textArea: { minHeight: 60, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  dayChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.lg,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  timeScroll: { flex: 1, maxHeight: 44 },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
    marginHorizontal: 2,
  },
  timeChipText: { fontSize: 16 },
  timeDisplay: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  intervalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
});
