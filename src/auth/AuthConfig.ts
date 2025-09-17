/**
 * React Native용 AuthManager 설정 및 초기화 헬퍼
 * A1 + M2(A) 패턴을 위한 설정과 Bridge 연동
 */

import { AuthManager, AuthManagerConfig } from '@growgrammers/auth-core';
import { NativeAuthBridge } from '../bridge/NativeAuthModule';
import { ReactNativeHttpClient } from './ReactNativeHttpClient';
import type { OAuthProvider } from '@growgrammers/auth-core';

/**
 * React Native 환경별 AuthManager 설정
 */
export interface ReactNativeAuthConfig {
  // === OAuth 설정 ===
  provider: OAuthProvider;
  googleClientId?: string;
  kakaoClientId?: string;
  
  // === API 서버 설정 ===
  apiBaseUrl: string;
  apiTimeout?: number;
  
  // === 개발/디버깅 설정 ===
  enableDebugLogs?: boolean;
  
  // === Bridge 선택 ===
  useMockBridge?: boolean; // true: 커스텀 Mock 사용, false: 실제 NativeAuthBridge 사용
}

/**
 * React Native AuthManager 팩토리
 * Bridge 설정과 AuthManager 생성을 한 번에 처리
 */
export class ReactNativeAuthFactory {
  private static bridge: NativeAuthBridge | null = null;
  private static authManager: AuthManager | null = null;

  /**
   * AuthManager 생성 및 초기화 (실제 생성 로직직)
   */
  static async createAuthManager(config: ReactNativeAuthConfig): Promise<AuthManager> {
    console.log('[ReactNativeAuthFactory] AuthManager 생성 시작:', {
      provider: config.provider,
      apiBaseUrl: config.apiBaseUrl,
      useMockBridge: config.useMockBridge
    });

    try {
      // 1. Bridge 초기화
      const bridge = await this.initializeBridge(config);
      
      // 2. HttpClient 생성
      const httpClient = new ReactNativeHttpClient(bridge);
      
      // 3. AuthManager 설정 구성
      const authConfig = this.buildAuthManagerConfig(config, httpClient, bridge);
      
      // 4. AuthManager 생성
      const authManager = new AuthManager(authConfig);
      
      // 5. 헬스 체크
      await this.performHealthCheck(authManager, bridge);
      
      // 6. 인스턴스 저장
      this.bridge = bridge;
      this.authManager = authManager;
      
      console.log('[ReactNativeAuthFactory] AuthManager 생성 완료');
      return authManager;
      
    } catch (error) {
      console.error('[ReactNativeAuthFactory] AuthManager 생성 실패:', error);
      throw error;
    }
  }

  /**
   * Bridge 초기화
   */
  private static async initializeBridge(config: ReactNativeAuthConfig): Promise<any> {
    if (config.useMockBridge) {
      // 커스텀 Mock Bridge 사용 (개발용)
      console.log('[ReactNativeAuthFactory] 커스텀 Mock Bridge 사용');
      return this.createCustomMockBridge();
    } else {
      // 실제 Native Bridge 사용
      console.log('[ReactNativeAuthFactory] 실제 Native Bridge 사용');
      const bridge = new NativeAuthBridge();
      
      // Bridge 상태 확인
      const isHealthy = await bridge.isHealthy();
      if (!isHealthy) {
        console.warn('[ReactNativeAuthFactory] Native Bridge 상태가 불안정하지만 계속 진행');
      }
      
      return bridge;
    }
  }

  /**
   * 커스텀 Mock Bridge 생성
   */
  private static createCustomMockBridge(): any {
    let mockAuthListeners: Array<(status: any, data?: any) => void> = [];
    let mockIsLoggedIn = false;
    let mockUserInfo: any = null;
    
    return {
      isHealthy: async () => true,
      callWithAuth: async (request: any) => {
        console.log('[CustomMockBridge] API 호출:', request.url);
        // 로그아웃 요청에 대해 성공 응답 반환
        if (request.url.includes('/api/v1/auth/google/logout')) {
          return {
            status: 200,
            ok: true,
            data: { success: true },
            headers: {}
          };
        }
        // 다른 요청에 대한 기본 응답
        return {
          status: 200,
          ok: true,
          data: { message: 'Mock API 호출 성공' },
          headers: {}
        };
      },
      startOAuth: async (provider: string) => {
        console.log('[CustomMockBridge] OAuth 시작:', provider);
        
        // OAuth 시작 이벤트 발생
        mockAuthListeners.forEach(listener => {
          try {
            listener('started', { provider });
          } catch (error) {
            console.error('[CustomMockBridge] 이벤트 리스너 오류:', error);
          }
        });
        
        // 1.5초 후 OAuth 성공 시뮬레이션 (실제 OAuth 플로우 시간과 유사)
        setTimeout(() => {
          console.log('[CustomMockBridge] OAuth 성공 시뮬레이션');
          
          // 가짜 사용자 정보 생성 (auth-core SessionInfo 형식에 맞춤)
          mockUserInfo = {
            sub: 'mock-user-123',  // auth-core 표준 필드
            id: 'mock-user-123',
            email: 'test@example.com',
            nickname: '홍길동',
            provider: provider
          };
          mockIsLoggedIn = true;
          
          // OAuth 성공 이벤트 발생
          mockAuthListeners.forEach(listener => {
            try {
              listener('success', { user: mockUserInfo, provider });
            } catch (error) {
              console.error('[CustomMockBridge] 이벤트 리스너 오류:', error);
            }
          });
        }, 1500);
        
        return { success: true };
      },
      getSession: async () => {
        console.log('[CustomMockBridge] 세션 정보 조회');
        return {
          isLoggedIn: mockIsLoggedIn,
          userInfo: mockUserInfo
        };
      },
      addAuthStatusListener: (listener: (status: any, data?: any) => void) => {
        console.log('[CustomMockBridge] 이벤트 리스너 추가');
        mockAuthListeners.push(listener);
      },
      removeAuthStatusListener: (listener: (status: any, data?: any) => void) => {
        console.log('[CustomMockBridge] 이벤트 리스너 제거');
        const index = mockAuthListeners.indexOf(listener);
        if (index > -1) {
          mockAuthListeners.splice(index, 1);
        }
      },
      signOut: async () => {
        console.log('[CustomMockBridge] 로그아웃');
        mockIsLoggedIn = false;
        mockUserInfo = null;
        
        // 로그아웃 이벤트 발생
        mockAuthListeners.forEach(listener => {
          try {
            listener('signed_out', {});
          } catch (error) {
            console.error('[CustomMockBridge] 이벤트 리스너 오류:', error);
          }
        });
        
        return true;
      },
      cleanup: () => {
        console.log('[CustomMockBridge] 정리');
        mockAuthListeners = [];
        mockIsLoggedIn = false;
        mockUserInfo = null;
      }
    };
  }

  /**
   * AuthManager 설정 구성
   */
  private static buildAuthManagerConfig(
    config: ReactNativeAuthConfig,
    httpClient: ReactNativeHttpClient,
    bridge: any
  ): AuthManagerConfig {
    const baseConfig: AuthManagerConfig = {
      // === 기본 설정 ===
      providerType: config.provider === 'google' ? 'google' : 'email',
      platform: 'react-native',
      
      // === 의존성 주입 ===
      httpClient: httpClient,
      tokenStoreType: 'react-native',
      nativeBridge: bridge,
      enableNativeDelegation: true,
      
      // === API 설정 ===
      apiConfig: {
        apiBaseUrl: config.apiBaseUrl,
        endpoints: {
          requestVerification: '/api/v1/auth/email/request',
          verifyEmail: '/api/v1/auth/email/verify',
          login: '/api/v1/auth/members/email-login',
          logout: '/api/v1/auth/members/logout',
          refresh: '/api/v1/auth/members/refresh',
          googleLogin: '/api/v1/auth/google/login',
          googleLogout: '/api/v1/auth/google/logout',
          googleRefresh: '/api/v1/auth/google/refresh',
          googleValidate: '/api/v1/auth/google/validate',
          googleUserinfo: '/api/v1/auth/google/userinfo',
          validate: '/api/v1/auth/validate-token',
          me: '/api/v1/auth/user-info',
          health: '/api/v1/health'
        },
        timeout: config.apiTimeout || 10000
      }
    };

    // Provider별 추가 설정
    if (config.provider === 'google' && config.googleClientId) {
      baseConfig.providerConfig = {
        googleClientId: config.googleClientId
      };
    }

    if (config.provider === 'kakao' && config.kakaoClientId) {
      baseConfig.providerConfig = {
        kakaoClientId: config.kakaoClientId
      };
    }

    return baseConfig;
  }

  /**
   * 헬스 체크 수행
   */
  private static async performHealthCheck(authManager: AuthManager, bridge: any): Promise<void> {
    console.log('[ReactNativeAuthFactory] 헬스 체크 시작');

    try {
      // 1. AuthManager 상태 확인
      const isReactNative = authManager.isReactNativePlatform();
      console.log('[ReactNativeAuthFactory] AuthManager RN 플랫폼 인식:', isReactNative);

      // 2. Bridge 상태 확인 (직접 확인)
      const isBridgeHealthy = await bridge.isHealthy?.() ?? true;
      console.log('[ReactNativeAuthFactory] Bridge 상태:', isBridgeHealthy ? '정상' : '비정상');

      // 3. 세션 상태 확인
      const session = await authManager.getCurrentSession();
      console.log('[ReactNativeAuthFactory] 현재 세션:', {
        isLoggedIn: session?.isLoggedIn || false,
        hasUserInfo: !!(session?.userInfo)
      });

      console.log('[ReactNativeAuthFactory] 헬스 체크 완료');
    } catch (error) {
      console.warn('[ReactNativeAuthFactory] 헬스 체크 실패 (계속 진행):', error);
    }
  }

  // === 싱글톤 인스턴스 관리 ===

  /**
   * 현재 AuthManager 인스턴스 반환
   */
  static getCurrentAuthManager(): AuthManager | null {
    return this.authManager;
  }

  /**
   * 현재 Bridge 인스턴스 반환
   */
  static getCurrentBridge(): any | null {
    return this.bridge;
  }

  /**
   * 인스턴스 정리
   */
  static cleanup(): void {
    console.log('[ReactNativeAuthFactory] 인스턴스 정리');
    
    if (this.bridge && typeof this.bridge.cleanup === 'function') {
      this.bridge.cleanup();
    }
    
    this.bridge = null;
    this.authManager = null;
  }
}

/**
 * 실제 네이티브 Bridge를 사용한 AuthManager 초기화
 * (안드로이드 네이티브 모듈 구현 완료 후 사용)
 */
export async function initializeAuth(config: ReactNativeAuthConfig): Promise<AuthManager> {
  return ReactNativeAuthFactory.createAuthManager(config);
}

/**
 * 실제 네이티브 환경에서 사용할 설정 예시
 * (네이티브 모듈 개발 완료 후 App.tsx에서 이렇게 사용)
 * 
 * const authManager = await initializeAuth({
 *   provider: 'google',
 *   apiBaseUrl: 'https://your-api-server.com',
 *   googleClientId: 'your-actual-google-client-id',
 *   useMockBridge: false,  // ← 실제 NativeAuthBridge 사용
 *   enableDebugLogs: false
 * });
 */

/**
 * 개발용 Mock AuthManager 초기화
 * 커스텀 Mock Bridge를 사용한 현실적인 OAuth 시뮬레이션
 */
export async function initializeMockAuth(config: Partial<ReactNativeAuthConfig> = {}): Promise<AuthManager> {
  const mockConfig: ReactNativeAuthConfig = {
    provider: 'google',
    apiBaseUrl: 'https://api.example.com',
    useMockBridge: true, // 커스텀 Mock Bridge 사용
    enableDebugLogs: true,
    ...config
  };
  // 팩토리 함수 호출하여 AuthManager 생성 요청
  return ReactNativeAuthFactory.createAuthManager(mockConfig);
}

/**
 * 기본 환경 설정
 */
export const defaultAuthConfig: Partial<ReactNativeAuthConfig> = {
  apiTimeout: 10000,
  enableDebugLogs: __DEV__,
  useMockBridge: __DEV__, // 개발 환경에서는 기본적으로 Mock 사용
};
