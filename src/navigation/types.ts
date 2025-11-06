/**
 * React Navigation 타입 정의
 * 각 화면의 route params를 정의합니다.
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  EmailInput: undefined;
  VerificationCode: undefined;
  GoogleContinue: undefined;
  KakaoContinue: undefined;
  NaverContinue: undefined;
  LoginComplete: undefined;
  ServiceMain: undefined;
  Dashboard: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

/**
 * ScreenType을 React Navigation route name으로 변환
 */
export type ScreenType = 'splash' | 'login' | 'email-input' | 'verification-code' | 'google-continue' | 'kakao-continue' | 'naver-continue' | 'login-complete' | 'service-main' | 'dashboard';

export function screenTypeToRouteName(screenType: ScreenType): keyof RootStackParamList {
  const mapping: Record<ScreenType, keyof RootStackParamList> = {
    'splash': 'Splash',
    'login': 'Login',
    'email-input': 'EmailInput',
    'verification-code': 'VerificationCode',
    'google-continue': 'GoogleContinue',
    'kakao-continue': 'KakaoContinue',
    'naver-continue': 'NaverContinue',
    'login-complete': 'LoginComplete',
    'service-main': 'ServiceMain',
    'dashboard': 'Dashboard',
  };
  
  return mapping[screenType];
}

