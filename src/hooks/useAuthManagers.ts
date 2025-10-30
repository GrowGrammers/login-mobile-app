/**
 * useAuthManagers - AuthManager들을 초기화하고 관리하는 훅
 * App.tsx에서 AuthManager 초기화 로직을 분리
 */

import { useState, useEffect } from 'react';
import { AuthManager } from '@growgrammers/auth-core';
import { 
  initializeMockEmailAuth, 
  initializeMockGoogleAuth, 
  initializeMockKakaoAuth, 
  initializeMockNaverAuth 
} from '../index';

interface AuthManagers {
  emailAuthManager: AuthManager | null;
  googleAuthManager: AuthManager | null;
  kakaoAuthManager: AuthManager | null;
  naverAuthManager: AuthManager | null;
}

interface UseAuthManagersReturn {
  authManagers: AuthManagers;
  initError: string | null;
  isLoading: boolean;
}

export function useAuthManagers(): UseAuthManagersReturn {
  const [authManagers, setAuthManagers] = useState<AuthManagers>({
    emailAuthManager: null,
    googleAuthManager: null,
    kakaoAuthManager: null,
    naverAuthManager: null,
  });
  const [initError, setInitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('[useAuthManagers] AuthManager들 초기화 시작...');
    
    const initializeAuthManagers = async () => {
      try {
        const [emailManager, googleManager, kakaoManager, naverManager] = await Promise.all([
          // 이메일 AuthManager 초기화
          initializeMockEmailAuth({
            apiBaseUrl: 'https://api.example.com',
            useMockBridge: true,
            enableDebugLogs: true
            // apiBaseUrl: 'https://your-real-api-server.com', // ← 실제 API 서버 URL
            // useMockBridge: false, // ← 네이티브 모듈 사용
            // enableDebugLogs: __DEV__
          }),
          // 구글 AuthManager 초기화
          initializeMockGoogleAuth({
            apiBaseUrl: 'https://api.example.com',
            googleClientId: 'mock-client-id-for-development',
            useMockBridge: true,
            enableDebugLogs: true
            // apiBaseUrl: 'https://your-real-api-server.com', // ← 실제 API 서버 URL
            // googleClientId: 'your-real-google-client-id', // ← 실제 구글 클라이언트 ID
            // useMockBridge: false, // ← 네이티브 모듈 사용
            // enableDebugLogs: __DEV__
          }),
          // 카카오 AuthManager 초기화
          initializeMockKakaoAuth({
            apiBaseUrl: 'https://api.example.com',
            kakaoClientId: 'mock-client-id-for-development',
            useMockBridge: true,
            enableDebugLogs: true
            // apiBaseUrl: 'https://your-real-api-server.com', // ← 실제 API 서버 URL
            // kakaoClientId: 'your-real-kakao-client-id', // ← 실제 카카오 클라이언트 ID
            // useMockBridge: false, // ← 네이티브 모듈 사용
            // enableDebugLogs: __DEV__
          }),
          // 네이버 AuthManager 초기화
          initializeMockNaverAuth({
            apiBaseUrl: 'https://api.example.com',
            naverClientId: 'mock-client-id-for-development',
            useMockBridge: true,
            enableDebugLogs: true
            // apiBaseUrl: 'https://your-real-api-server.com', // ← 실제 API 서버 URL
            // naverClientId: 'your-real-naver-client-id', // ← 실제 네이버 클라이언트 ID
            // useMockBridge: false, // ← 네이티브 모듈 사용
            // enableDebugLogs: __DEV__
          })
        ]);

        console.log('[useAuthManagers] AuthManager들 초기화 성공!');
        setAuthManagers({
          emailAuthManager: emailManager,
          googleAuthManager: googleManager,
          kakaoAuthManager: kakaoManager,
          naverAuthManager: naverManager,
        });
        setInitError(null);
      } catch (error) {
        console.error('[useAuthManagers] AuthManager 초기화 실패:', error);
        setInitError(error instanceof Error ? error.message : '초기화 실패');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuthManagers();
  }, []);

  return {
    authManagers,
    initError,
    isLoading,
  };
}
