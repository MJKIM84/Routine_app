import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Vibration,
  Platform,
} from 'react-native';
import { Typography } from '@ui/shared/components/Typography';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { haptics } from '@platform/haptics';
import type { RoutineData } from '@core/types';

interface RoutineTimerModalProps {
  visible: boolean;
  routine: RoutineData | null;
  onClose: () => void;
  onComplete: (routineId: string, durationSeconds: number) => void;
}

type TimerState = 'ready' | 'running' | 'paused' | 'finished';

export function RoutineTimerModal({
  visible,
  routine,
  onClose,
  onComplete,
}: RoutineTimerModalProps) {
  const colors = useThemeColors();
  const totalSeconds = (routine?.durationMinutes ?? 1) * 60;

  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [timerState, setTimerState] = useState<TimerState>('ready');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset when modal opens
  useEffect(() => {
    if (visible && routine) {
      const total = (routine.durationMinutes ?? 1) * 60;
      setRemainingSeconds(total);
      setElapsedSeconds(0);
      setTimerState('ready');
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, routine]);

  // Timer tick
  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            // Timer finished!
            clearInterval(intervalRef.current!);
            setTimerState('finished');
            haptics.success();
            if (Platform.OS !== 'web') {
              Vibration.vibrate([0, 500, 200, 500]);
            }
            return 0;
          }
          return prev - 1;
        });
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState]);

  const handleStart = useCallback(() => {
    haptics.medium();
    setTimerState('running');
  }, []);

  const handlePause = useCallback(() => {
    haptics.light();
    setTimerState('paused');
  }, []);

  const handleResume = useCallback(() => {
    haptics.light();
    setTimerState('running');
  }, []);

  const handleReset = useCallback(() => {
    haptics.light();
    const total = (routine?.durationMinutes ?? 1) * 60;
    setRemainingSeconds(total);
    setElapsedSeconds(0);
    setTimerState('ready');
  }, [routine]);

  const handleComplete = useCallback(() => {
    if (!routine) return;
    haptics.success();
    onComplete(routine.id, elapsedSeconds);
  }, [routine, elapsedSeconds, onComplete]);

  const handleSkipComplete = useCallback(() => {
    if (!routine) return;
    haptics.success();
    onComplete(routine.id, 0);
  }, [routine, onComplete]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Progress (0 to 1)
  const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;

  if (!routine) return null;

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Typography variant="body" color="secondary">✕</Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSkipComplete}>
            <Typography variant="body" color="accent">완료 처리</Typography>
          </TouchableOpacity>
        </View>

        {/* Routine Info */}
        <View style={styles.routineInfo}>
          <Typography variant="h1" style={{ fontSize: 48 }}>{routine.icon}</Typography>
          <Typography variant="h2" style={{ marginTop: spacing.md, textAlign: 'center' }}>
            {routine.title}
          </Typography>
          {routine.description && (
            <Typography variant="body" color="secondary" style={{ marginTop: spacing.xs, textAlign: 'center' }}>
              {routine.description}
            </Typography>
          )}
        </View>

        {/* Timer Circle */}
        <View style={styles.timerContainer}>
          {/* Progress ring (simplified) */}
          <View style={[styles.timerRing, { borderColor: routine.color + '20' }]}>
            <View
              style={[
                styles.timerProgress,
                {
                  borderColor: routine.color,
                  borderTopColor: progress > 0.25 ? routine.color : 'transparent',
                  borderRightColor: progress > 0.5 ? routine.color : 'transparent',
                  borderBottomColor: progress > 0.75 ? routine.color : 'transparent',
                  borderLeftColor: progress > 0 ? routine.color : 'transparent',
                  transform: [{ rotate: `${progress * 360}deg` }],
                },
              ]}
            />
            <View style={styles.timerInner}>
              <Typography
                variant="h1"
                style={[styles.timerText, { color: timerState === 'finished' ? routine.color : colors.text }]}
              >
                {timerState === 'finished' ? '완료!' : formatTime(remainingSeconds)}
              </Typography>
              {timerState !== 'finished' && (
                <Typography variant="caption" color="tertiary" style={{ marginTop: 4 }}>
                  {routine.durationMinutes}분 중 {formatTime(elapsedSeconds)} 경과
                </Typography>
              )}
            </View>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {timerState === 'ready' && (
            <TouchableOpacity
              onPress={handleStart}
              style={[styles.mainBtn, { backgroundColor: routine.color }]}
            >
              <Typography variant="h3" style={{ color: '#fff' }}>시작 ▶</Typography>
            </TouchableOpacity>
          )}

          {timerState === 'running' && (
            <TouchableOpacity
              onPress={handlePause}
              style={[styles.mainBtn, { backgroundColor: '#FF9800' }]}
            >
              <Typography variant="h3" style={{ color: '#fff' }}>일시정지 ⏸</Typography>
            </TouchableOpacity>
          )}

          {timerState === 'paused' && (
            <View style={styles.controlRow}>
              <TouchableOpacity
                onPress={handleReset}
                style={[styles.secondaryBtn, { borderColor: colors.cardBorder }]}
              >
                <Typography variant="body">초기화</Typography>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleResume}
                style={[styles.mainBtn, { backgroundColor: routine.color, flex: 1 }]}
              >
                <Typography variant="h3" style={{ color: '#fff' }}>계속 ▶</Typography>
              </TouchableOpacity>
            </View>
          )}

          {timerState === 'finished' && (
            <TouchableOpacity
              onPress={handleComplete}
              style={[styles.mainBtn, { backgroundColor: routine.color }]}
            >
              <Typography variant="h3" style={{ color: '#fff' }}>루틴 완료 ✓</Typography>
            </TouchableOpacity>
          )}
        </View>

        {/* Elapsed info */}
        {timerState !== 'ready' && timerState !== 'finished' && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%`, backgroundColor: routine.color },
              ]}
            />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: spacing.base,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routineInfo: { alignItems: 'center', marginTop: spacing.xl },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerRing: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerProgress: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 8,
  },
  timerInner: { alignItems: 'center' },
  timerText: { fontSize: 48, fontWeight: '700', fontVariant: ['tabular-nums'] },
  controls: { paddingBottom: 50 },
  mainBtn: {
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  secondaryBtn: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 40,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
});
