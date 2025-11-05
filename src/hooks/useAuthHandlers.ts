/**
 * useAuthHandlers - 인증 관련 핸들러들을 관리하는 훅
 * App.tsx에서 핸들러 로직을 분리하여 재사용성과 테스트 용이성 향상
 */

import { useCallback } from 'react';
import type { AuthManager } from '@growgrammers/auth-core';
import { AuthActions } from '../utils/AuthEventHandler';

interface UseAuthHandlersProps {
  emailAuthManager: AuthManager;
  googleAuthManager: AuthManager;
  kakaoAuthManager: AuthManager;
  naverAuthManager: AuthManager;
  switchToGoogleAuth: () => void;
  switchToKakaoAuth: () => void;
  switchToNaverAuth: () => void;
  clearError: () => void;
  handleBackToSplash: () => void;
  authActions: AuthActions;
}

interface UseAuthHandlersReturn {
  handleOAuthLogin: (provider: 'google' | 'kakao' | 'naver') => Promise<void>;
  handleLogout: () => Promise<void>;
}

/**
 * 인증 핸들러 훅
 * OAuth 로그인 및 로그아웃 핸들러를 제공
 */
export function useAuthHandlers({
  googleAuthManager,
  kakaoAuthManager,
  naverAuthManager,
  switchToGoogleAuth,
  switchToKakaoAuth,
  switchToNaverAuth,
  clearError,
  handleBackToSplash,
  authActions,
}: UseAuthHandlersProps): UseAuthHandlersReturn {
  // OAuth 계속하기에서 실제 로그인 시도
  const handleOAuthLogin = useCallback(async (provider: 'google' | 'kakao' | 'naver') => {
    console.log(`[useAuthHandlers] ${provider} 로그인 시작`);
    
    // 해당 AuthManager로 전환
    if (provider === 'google') {
      switchToGoogleAuth();
    } else if (provider === 'kakao') {
      switchToKakaoAuth();
    } else if (provider === 'naver') {
      switchToNaverAuth();
    }
    
    clearError();
    
    try {
      let oauthAuthActions;
      if (provider === 'google') {
        oauthAuthActions = new AuthActions(googleAuthManager);
      } else if (provider === 'kakao') {
        oauthAuthActions = new AuthActions(kakaoAuthManager);
      } else {
        oauthAuthActions = new AuthActions(naverAuthManager);
      }
      
      const success = await oauthAuthActions.startOAuth(provider);
      if (success) {
        console.log(`[useAuthHandlers] ${provider} 로그인 시작 성공`);
      } else {
        console.log(`[useAuthHandlers] ${provider} 로그인 시작 실패`);
      }
    } catch (error) {
      console.error(`[useAuthHandlers] ${provider} 로그인 예외:`, error);
    }
  }, [
    switchToGoogleAuth,
    switchToKakaoAuth,
    switchToNaverAuth,
    clearError,
    googleAuthManager,
    kakaoAuthManager,
    naverAuthManager,
  ]);

  // 로그아웃 핸들러
  const handleLogout = useCallback(async () => {
    console.log('[useAuthHandlers] 로그아웃 시작');
    
    try {
      const success = await authActions.signOut();
      if (success) {
        console.log('[useAuthHandlers] 로그아웃 성공');
        // 웹 앱과 동일하게 스플래시 화면으로 리다이렉트
        handleBackToSplash();
      } else {
        console.log('[useAuthHandlers] 로그아웃 실패');
        // 실패해도 스플래시 화면으로 이동 (로컬 세션 정리)
        handleBackToSplash();
      }
    } catch (error) {
      console.error('[useAuthHandlers] 로그아웃 예외:', error);
      // 예외 발생해도 스플래시 화면으로 이동 (로컬 세션 정리)
      handleBackToSplash();
    }
  }, [authActions, handleBackToSplash]);

  return {
    handleOAuthLogin,
    handleLogout,
  };
}


