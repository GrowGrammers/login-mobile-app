/**
 * CommonStyles - 여러 컴포넌트에서 공통으로 사용되는 스타일
 */

import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const commonStyles = StyleSheet.create({
  // 레이아웃
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  row: {
    flexDirection: 'row',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  alignCenter: {
    alignItems: 'center',
  },
  
  // 패딩
  paddingHorizontal: {
    paddingHorizontal: theme.spacing['2xl'],
  },
  
  paddingVertical: {
    paddingVertical: theme.spacing.lg,
  },
  
  paddingAll: {
    padding: theme.spacing['2xl'],
  },
  
  // 마진
  marginBottom: {
    marginBottom: theme.spacing.lg,
  },
  
  marginTop: {
    marginTop: theme.spacing.lg,
  },
  
  // 텍스트
  textCenter: {
    textAlign: 'center',
  },
  
  textLeft: {
    textAlign: 'left',
  },
  
  textRight: {
    textAlign: 'right',
  },
  
  // 버튼 기본 스타일
  button: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing['2xl'],
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  
  buttonDisabled: {
    opacity: 0.6,
  },
  
  // 입력 필드 기본 스타일
  input: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.base,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  
  // 카드 기본 스타일
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing['2xl'],
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  
  // 헤더 기본 스타일
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.backgroundTertiary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  
  // 에러 메시지 스타일
  errorMessage: {
    backgroundColor: theme.colors.errorLight,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  
  // 성공 메시지 스타일
  successMessage: {
    backgroundColor: theme.colors.successLight,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xl,
  },
  
  // 로딩 스타일
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
});

export default commonStyles;
