/**
 * ComponentStyles - 특정 컴포넌트에서 사용되는 스타일
 */

import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const headerStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.backgroundTertiary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: theme.typography.fontSize['2xl'],
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  spacer: {
    width: 40,
  },
});

export const messageDisplayStyles = StyleSheet.create({
  messageContainer: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing['2xl'],
    width: '100%',
  },
  messageText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
  },
  successMessage: {
    backgroundColor: theme.colors.successLight,
  },
  successMessageText: {
    color: theme.colors.successText,
  },
  errorMessage: {
    backgroundColor: theme.colors.errorLight,
  },
  errorMessageText: {
    color: theme.colors.errorText,
  },
  warningMessage: {
    backgroundColor: theme.colors.warningLight,
  },
  warningMessageText: {
    color: theme.colors.warningText,
  },
  infoMessage: {
    backgroundColor: theme.colors.infoLight,
  },
  infoMessageText: {
    color: theme.colors.infoText,
  },
});

export const buttonStyles = StyleSheet.create({
  oauthButton: {
    width: '100%',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing['2xl'],
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.md,
  },
  googleOAuthButton: {
    backgroundColor: theme.colors.google,
  },
  kakaoOAuthButton: {
    backgroundColor: theme.colors.kakao,
  },
  naverOAuthButton: {
    backgroundColor: theme.colors.naver,
  },
  emailOAuthButton: {
    backgroundColor: theme.colors.primary,
  },
  oauthButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textInverse,
    textAlign: 'center',
  },
  kakaoOAuthButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.kakaoText,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export const inputStyles = StyleSheet.create({
  emailInput: {
    width: '100%',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.base,
    backgroundColor: theme.colors.backgroundSecondary,
    marginBottom: theme.spacing['2xl'],
  },
  digitInput: {
    width: 48,
    height: 64,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.semibold,
    backgroundColor: theme.colors.backgroundSecondary,
    textAlign: 'center',
  },
});

export const cardStyles = StyleSheet.create({
  dashboardCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing['2xl'],
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userInfoContainer: {
    gap: theme.spacing.md,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    minWidth: 80,
  },
  userInfoValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
  noUserInfoContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing['3xl'],
  },
  noUserInfoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export const screenStyles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  splashTitle: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing['4xl'],
  },
  splashButtonContainer: {
    width: '100%',
    maxWidth: 400,
  },
  loginSelectorContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: theme.spacing.xl,
    right: theme.spacing.xl,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginSelectorContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  loginSelectorHeader: {
    paddingTop: 200,
    paddingHorizontal: theme.spacing['2xl'],
    paddingBottom: theme.spacing['5xl'],
    alignItems: 'center',
  },
  loginSelectorTitle: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  loginSelectorSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.relaxed,
    maxHeight: 44,
  },
  loginSelectorButtons: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing['3xl'],
    paddingTop: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  bottomSheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.sm,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    width: '100%',
  },
  forgotAccountText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  termsText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.tight,
  },
});

export default {
  headerStyles,
  messageDisplayStyles,
  buttonStyles,
  inputStyles,
  cardStyles,
  screenStyles,
};
