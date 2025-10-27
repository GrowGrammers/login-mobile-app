/**
 * Theme - 앱 전체에서 사용되는 디자인 토큰
 * 색상, 폰트, 간격, 그림자 등을 정의
 */

export const colors = {
  // 기본 색상
  primary: '#1a1a1a',
  secondary: '#666',
  tertiary: '#999',
  
  // 배경 색상
  background: '#f5f5f5',
  backgroundSecondary: '#f9fafb',
  backgroundTertiary: '#f3f4f6',
  surface: '#ffffff',
  
  // 텍스트 색상
  textPrimary: '#1a1a1a',
  textSecondary: '#666',
  textTertiary: '#999',
  textInverse: '#ffffff',
  
  // 상태 색상
  success: '#10b981',
  successLight: '#dcfce7',
  successText: '#166534',
  
  error: '#dc2626',
  errorLight: '#fef2f2',
  errorText: '#dc2626',
  
  warning: '#d97706',
  warningLight: '#fef3c7',
  warningText: '#d97706',
  
  info: '#1d4ed8',
  infoLight: '#dbeafe',
  infoText: '#1d4ed8',
  
  // OAuth 색상
  google: '#4285f4',
  kakao: '#fee500',
  kakaoText: '#000000',
  naver: '#03c75a',
  
  // 테두리 색상
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  
  // 비활성화 색상
  disabled: '#999',
  disabledBackground: 'rgba(0, 0, 0, 0.1)',
} as const;

export const typography = {
  // 폰트 크기
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 48,
  },
  
  // 폰트 두께
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // 줄 높이
  lineHeight: {
    tight: 16,
    normal: 20,
    relaxed: 24,
  },
} as const;

export const spacing = {
  // 간격
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export const borderRadius = {
  // 모서리 둥글기
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const shadows = {
  // 그림자
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
