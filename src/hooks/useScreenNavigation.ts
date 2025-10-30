/**
 * useScreenNavigation - 화면 네비게이션과 AuthManager 전환을 관리하는 훅
 * App.tsx에서 화면 전환 로직을 분리
 */

import { useState, useCallback, useEffect } from 'react';
import { AuthManager } from '@growgrammers/auth-core';
import { useAuthState } from '../utils/AuthEventHandler';

export type ScreenType = 'splash' | 'login' | 'email-input' | 'verification-code' | 'google-continue' | 'kakao-continue' | 'naver-continue' | 'login-complete' | 'service-main' | 'dashboard';

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
  
  // 현재 AuthManager의 인증 상태 감시
  const { authState } = useAuthState(currentAuthManager);

  // 소셜 로그인 성공 시 LoginComplete 화면으로 자동 이동 (한 번만)
  useEffect(() => {
    if (authState.loginSuccessTriggered && authState.isLoggedIn && 
        currentScreen !== 'login-complete' && 
        currentScreen !== 'dashboard' && 
        currentScreen !== 'service-main') {
      console.log('[useScreenNavigation] 소셜 로그인 성공 감지 - LoginComplete 화면으로 이동');
      setCurrentScreen('login-complete');
    }
  }, [authState.loginSuccessTriggered, authState.isLoggedIn, currentScreen]);

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

  // 스플래시에서 시작하기 버튼 핸들러
  const handleStartApp = useCallback(() => {
    setCurrentScreen('login');
  }, []);

  // 스플래시로 돌아가기 핸들러
  const handleBackToSplash = useCallback(() => {
    setCurrentScreen('splash');
    // 로그아웃 시 이메일 상태 초기화
    setEmailForVerification('');
  }, []);

  // 뒤로가기 핸들러
  const handleBack = useCallback(() => {
    setCurrentScreen('login');
  }, []);

  // 이메일 로그인 시작 핸들러
  const handleEmailLogin = useCallback(() => {
    console.log('[useScreenNavigation] 이메일 로그인 시작');
    switchToEmailAuth();
    setCurrentScreen('email-input');
  }, [switchToEmailAuth]);

  // OAuth 계속하기 화면으로 이동
  const handleOAuthContinue = useCallback((provider: 'google' | 'kakao' | 'naver') => {
    setCurrentScreen(`${provider}-continue` as ScreenType);
  }, []);

  // 로그인 성공 핸들러
  const handleLoginSuccess = useCallback(() => {
    console.log('[useScreenNavigation] 로그인 성공 - LoginComplete 화면으로 이동');
    setCurrentScreen('login-complete');
  }, []);

  // 지금 연동하러 가기 (대시보드로)
  const handleConnectNow = useCallback(() => {
    console.log('[useScreenNavigation] 지금 연동하러 가기 - 대시보드로 이동');
    setCurrentScreen('dashboard');
  }, []);

  // 다음에 할게요 (서비스 메인으로)
  const handleLater = useCallback(() => {
    console.log('[useScreenNavigation] 다음에 할게요 - 서비스 메인으로 이동');
    setCurrentScreen('service-main');
  }, []);

  // 회원정보 확인 (대시보드로)
  const handleGoToDashboard = useCallback(() => {
    console.log('[useScreenNavigation] 회원정보 확인 - 대시보드로 이동');
    setCurrentScreen('dashboard');
  }, []);

  // 로그인하러 가기 (로그인 선택으로)
  const handleGoToLogin = useCallback(() => {
    console.log('[useScreenNavigation] 로그인하러 가기 - 로그인 선택으로 이동');
    setCurrentScreen('login');
  }, []);

  // 로그인 완료 화면으로 돌아가기
  const handleBackToLoginComplete = useCallback(() => {
    console.log('[useScreenNavigation] 로그인 완료 화면으로 돌아가기');
    setCurrentScreen('login-complete');
  }, []);


  return {
    currentScreen,
    currentAuthManager,
    currentProvider,
    emailForVerification,
    setCurrentScreen,
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
  };
}
