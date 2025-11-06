/**
 * useScreenNavigation - 화면 네비게이션과 AuthManager 전환을 관리하는 훅
 * App.tsx에서 화면 전환 로직을 분리
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { AuthManager } from '@growgrammers/auth-core';
import { useAuthState } from '../utils/AuthEventHandler';
import type { NavigationContainerRef } from '@react-navigation/native';
import { NavigationState } from '@react-navigation/native';
import type { RootStackParamList, ScreenType } from '../navigation/types';
import { screenTypeToRouteName } from '../navigation/types';

export type ProviderType = 'email' | 'google' | 'kakao' | 'naver';

interface UseScreenNavigationProps {
  emailAuthManager: AuthManager;
  googleAuthManager: AuthManager;
  kakaoAuthManager: AuthManager;
  naverAuthManager: AuthManager;
}

interface UseScreenNavigationReturn {
  currentScreen: ScreenType;
  currentAuthManager: AuthManager;
  currentProvider: ProviderType;
  emailForVerification: string;
  setCurrentScreen: (screen: ScreenType) => void;
  setEmailForVerification: (email: string) => void;
  handleStartApp: () => void;
  handleBackToSplash: () => void;
  handleBack: () => void;
  handleEmailLogin: () => void;
  handleOAuthContinue: (provider: 'google' | 'kakao' | 'naver') => void;
  handleLoginSuccess: () => void;
  handleConnectNow: () => void;
  handleLater: () => void;
  handleGoToDashboard: () => void;
  handleGoToLogin: () => void;
  handleBackToLoginComplete: () => void;
  switchToGoogleAuth: () => void;
  switchToEmailAuth: () => void;
  switchToKakaoAuth: () => void;
  switchToNaverAuth: () => void;
  // React Navigation 통합
  setNavigationRef: (navigation: NavigationContainerRef<RootStackParamList> | null) => void;
  onNavigationStateChange: (state: NavigationState<RootStackParamList> | undefined) => void;
}

export function useScreenNavigation({
  emailAuthManager,
  googleAuthManager,
  kakaoAuthManager,
  naverAuthManager,
}: UseScreenNavigationProps): UseScreenNavigationReturn {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [currentAuthManager, setCurrentAuthManager] = useState<AuthManager>(emailAuthManager);
  const [currentProvider, setCurrentProvider] = useState<ProviderType>('email');
  const [emailForVerification, setEmailForVerification] = useState<string>('');
  
  // React Navigation ref
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList> | null>(null);
  
  // 현재 AuthManager의 인증 상태 감시
  const { authState } = useAuthState(currentAuthManager);
  
  // route name을 ScreenType으로 변환하는 맵
  const routeNameToScreenType = useMemo<Record<keyof RootStackParamList, ScreenType>>(() => ({
    'Splash': 'splash',
    'Login': 'login',
    'EmailInput': 'email-input',
    'VerificationCode': 'verification-code',
    'GoogleContinue': 'google-continue',
    'KakaoContinue': 'kakao-continue',
    'NaverContinue': 'naver-continue',
    'LoginComplete': 'login-complete',
    'ServiceMain': 'service-main',
    'Dashboard': 'dashboard',
  }), []);
  
  // ScreenType을 React Navigation route name으로 변환하는 헬퍼
  const navigateToScreen = useCallback((screen: ScreenType) => {
    const routeName = screenTypeToRouteName(screen);
    
    if (navigationRef.current?.isReady()) {
      // React Navigation의 애니메이션이 완료될 때까지 상태 업데이트를 지연
      // 상태는 NavigationContainer의 onStateChange에서 자동으로 동기화됩니다
      navigationRef.current.navigate(routeName as any);
    } else {
      // Navigation이 준비되지 않았을 때만 직접 상태 업데이트
      setCurrentScreen(screen);
    }
  }, []);


  // 소셜 로그인 성공 시 LoginComplete 화면으로 자동 이동 (한 번만)
  useEffect(() => {
    if (authState.loginSuccessTriggered && authState.isLoggedIn && 
        currentScreen !== 'login-complete' && 
        currentScreen !== 'dashboard' && 
        currentScreen !== 'service-main') {
      console.log('[useScreenNavigation] 소셜 로그인 성공 감지 - LoginComplete 화면으로 이동');
      navigateToScreen('login-complete');
    }
  }, [authState.loginSuccessTriggered, authState.isLoggedIn, currentScreen, navigateToScreen]);

  // 구글 AuthManager로 전환
  const switchToGoogleAuth = useCallback(() => {
    if (currentProvider !== 'google') {
      console.log('[useScreenNavigation] 구글 AuthManager로 전환');
      setCurrentAuthManager(googleAuthManager);
      setCurrentProvider('google');
    }
  }, [currentProvider, googleAuthManager]);

  // 이메일 AuthManager로 전환
  const switchToEmailAuth = useCallback(() => {
    if (currentProvider !== 'email') {
      console.log('[useScreenNavigation] 이메일 AuthManager로 전환');
      setCurrentAuthManager(emailAuthManager);
      setCurrentProvider('email');
    }
  }, [currentProvider, emailAuthManager]);

  // 카카오 AuthManager로 전환
  const switchToKakaoAuth = useCallback(() => {
    if (currentProvider !== 'kakao') {
      console.log('[useScreenNavigation] 카카오 AuthManager로 전환');
      setCurrentAuthManager(kakaoAuthManager);
      setCurrentProvider('kakao');
    }
  }, [currentProvider, kakaoAuthManager]);

  // 네이버 AuthManager로 전환
  const switchToNaverAuth = useCallback(() => {
    if (currentProvider !== 'naver') {
      console.log('[useScreenNavigation] 네이버 AuthManager로 전환');
      setCurrentAuthManager(naverAuthManager);
      setCurrentProvider('naver');
    }
  }, [currentProvider, naverAuthManager]);

  // React Navigation ref 설정 (단순화)
  const setNavigationRef = useCallback((navigation: NavigationContainerRef<RootStackParamList> | null) => {
    navigationRef.current = navigation;
  }, []);

  // 네비게이션 상태 변경 핸들러 (NavigationContainer의 onStateChange에서 호출)
  const onNavigationStateChange = useCallback((state: NavigationState<RootStackParamList> | undefined) => {
    if (state) {
      const route = state.routes[state.index];
      if (route) {
        const screen = routeNameToScreenType[route.name as keyof RootStackParamList];
        if (screen) {
          setCurrentScreen(screen);
        }
      }
    }
  }, [routeNameToScreenType]);

  // 스플래시에서 시작하기 버튼 핸들러
  const handleStartApp = useCallback(() => {
    navigateToScreen('login');
  }, [navigateToScreen]);

  // 스플래시로 돌아가기 핸들러
  const handleBackToSplash = useCallback(() => {
    navigateToScreen('splash');
    // 로그아웃 시 이메일 상태 초기화
    setEmailForVerification('');
  }, [navigateToScreen]);

  // 뒤로가기 핸들러
  const handleBack = useCallback(() => {
    if (navigationRef.current?.isReady() && navigationRef.current.canGoBack()) {
      navigationRef.current.goBack();
    } else {
      navigateToScreen('login');
    }
  }, [navigateToScreen]);

  // 이메일 로그인 시작 핸들러
  const handleEmailLogin = useCallback(() => {
    console.log('[useScreenNavigation] 이메일 로그인 시작');
    switchToEmailAuth();
    navigateToScreen('email-input');
  }, [switchToEmailAuth, navigateToScreen]);

  // OAuth 계속하기 화면으로 이동
  const handleOAuthContinue = useCallback((provider: 'google' | 'kakao' | 'naver') => {
    navigateToScreen(`${provider}-continue` as ScreenType);
  }, [navigateToScreen]);

  // 로그인 성공 핸들러
  const handleLoginSuccess = useCallback(() => {
    console.log('[useScreenNavigation] 로그인 성공 - LoginComplete 화면으로 이동');
    navigateToScreen('login-complete');
  }, [navigateToScreen]);

  // 지금 연동하러 가기 (대시보드로)
  const handleConnectNow = useCallback(() => {
    console.log('[useScreenNavigation] 지금 연동하러 가기 - 대시보드로 이동');
    navigateToScreen('dashboard');
  }, [navigateToScreen]);

  // 다음에 할게요 (서비스 메인으로)
  const handleLater = useCallback(() => {
    console.log('[useScreenNavigation] 다음에 할게요 - 서비스 메인으로 이동');
    navigateToScreen('service-main');
  }, [navigateToScreen]);

  // 회원정보 확인 (대시보드로)
  const handleGoToDashboard = useCallback(() => {
    console.log('[useScreenNavigation] 회원정보 확인 - 대시보드로 이동');
    navigateToScreen('dashboard');
  }, [navigateToScreen]);

  // 로그인하러 가기 (로그인 선택으로)
  const handleGoToLogin = useCallback(() => {
    console.log('[useScreenNavigation] 로그인하러 가기 - 로그인 선택으로 이동');
    navigateToScreen('login');
  }, [navigateToScreen]);

  // 로그인 완료 화면으로 돌아가기
  const handleBackToLoginComplete = useCallback(() => {
    console.log('[useScreenNavigation] 로그인 완료 화면으로 돌아가기');
    navigateToScreen('login-complete');
  }, [navigateToScreen]);


  return {
    currentScreen,
    currentAuthManager,
    currentProvider,
    emailForVerification,
    setCurrentScreen: navigateToScreen, // React Navigation으로 통합
    setEmailForVerification,
    handleStartApp,
    handleBackToSplash,
    handleBack,
    handleEmailLogin,
    handleOAuthContinue,
    handleLoginSuccess,
    handleConnectNow,
    handleLater,
    handleGoToDashboard,
    handleGoToLogin,
    handleBackToLoginComplete,
    switchToGoogleAuth,
    switchToEmailAuth,
    switchToKakaoAuth,
    switchToNaverAuth,
    setNavigationRef,
    onNavigationStateChange,
  };
}
