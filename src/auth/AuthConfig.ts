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
  provider: OAuthProvider | 'email';
  googleClientId?: string;
  kakaoClientId?: string;
  naverClientId?: string;
  
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
  private static emailAuthManager: AuthManager | null = null;
  private static googleAuthManager: AuthManager | null = null;
  private static kakaoAuthManager: AuthManager | null = null;
  private static naverAuthManager: AuthManager | null = null;

  /**
   * 이메일 AuthManager 생성 및 초기화
   */
  static async createEmailAuthManager(config: ReactNativeAuthConfig): Promise<AuthManager> {
    console.log('[ReactNativeAuthFactory] Email AuthManager 생성 시작');
    
    if (this.emailAuthManager) {
      console.log('[ReactNativeAuthFactory] 기존 Email AuthManager 반환');
      return this.emailAuthManager;
    }

    try {
      // 1. Bridge 초기화
      const bridge = await this.initializeBridge(config);
      
      // 2. HttpClient 생성
      const httpClient = new ReactNativeHttpClient(bridge);
      
      // 3. 이메일 AuthManager 설정 구성
      const authConfig = this.buildAuthManagerConfig({
        ...config,
        provider: 'email'
      }, httpClient, bridge);
      
      // 4. AuthManager 생성
      const authManager = new AuthManager(authConfig);
      
      // 5. 헬스 체크
      await this.performHealthCheck(authManager, bridge);
      
      // 6. 인스턴스 저장
      this.bridge = bridge;
      this.emailAuthManager = authManager;
      
      console.log('[ReactNativeAuthFactory] Email AuthManager 생성 완료');
      return authManager;
      
    } catch (error) {
      console.error('[ReactNativeAuthFactory] Email AuthManager 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 구글 AuthManager 생성 및 초기화
   */
  static async createGoogleAuthManager(config: ReactNativeAuthConfig): Promise<AuthManager> {
    console.log('[ReactNativeAuthFactory] Google AuthManager 생성 시작');
    
    if (this.googleAuthManager) {
      console.log('[ReactNativeAuthFactory] 기존 Google AuthManager 반환');
      return this.googleAuthManager;
    }

    try {
      // 1. Bridge 초기화
      const bridge = await this.initializeBridge(config);
      
      // 2. HttpClient 생성
      const httpClient = new ReactNativeHttpClient(bridge);
      
      // 3. 구글 AuthManager 설정 구성
      const authConfig = this.buildAuthManagerConfig({
        ...config,
        provider: 'google'
      }, httpClient, bridge);
      
      // 4. AuthManager 생성
      const authManager = new AuthManager(authConfig);
      
      // 5. 헬스 체크
      await this.performHealthCheck(authManager, bridge);
      
      // 6. 인스턴스 저장
      this.bridge = bridge;
      this.googleAuthManager = authManager;
      
      console.log('[ReactNativeAuthFactory] Google AuthManager 생성 완료');
      return authManager;
      
    } catch (error) {
      console.error('[ReactNativeAuthFactory] Google AuthManager 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 카카오 OAuth 전용 AuthManager 생성
   */
  static async createKakaoAuthManager(config: ReactNativeAuthConfig): Promise<AuthManager> {
    console.log('[ReactNativeAuthFactory] Kakao AuthManager 생성 시작');
    
    if (this.kakaoAuthManager) {
      console.log('[ReactNativeAuthFactory] 기존 Kakao AuthManager 반환');
      return this.kakaoAuthManager;
    }

    try {
      // 1. Bridge 초기화
      const bridge = await this.initializeBridge(config);
      
      // 2. HttpClient 생성
      const httpClient = new ReactNativeHttpClient(bridge);
      
      // 3. 카카오 AuthManager 설정 구성
      const authConfig = this.buildAuthManagerConfig({
        ...config,
        provider: 'kakao'
      }, httpClient, bridge);
      
      // 4. AuthManager 생성
      const authManager = new AuthManager(authConfig);
      
      // 5. 헬스 체크
      await this.performHealthCheck(authManager, bridge);
      
      // 6. 인스턴스 저장
      this.bridge = bridge;
      this.kakaoAuthManager = authManager;
      
      console.log('[ReactNativeAuthFactory] Kakao AuthManager 생성 완료');
      return authManager;
      
    } catch (error) {
      console.error('[ReactNativeAuthFactory] Kakao AuthManager 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 네이버 OAuth 전용 AuthManager 생성
   */
  static async createNaverAuthManager(config: ReactNativeAuthConfig): Promise<AuthManager> {
    console.log('[ReactNativeAuthFactory] Naver AuthManager 생성 시작');
    
    if (this.naverAuthManager) {
      console.log('[ReactNativeAuthFactory] 기존 Naver AuthManager 반환');
      return this.naverAuthManager;
    }

    try {
      // 1. Bridge 초기화
      const bridge = await this.initializeBridge(config);
      
      // 2. HttpClient 생성
      const httpClient = new ReactNativeHttpClient(bridge);
      
      // 3. 네이버 AuthManager 설정 구성
      const authConfig = this.buildAuthManagerConfig({
        ...config,
        provider: 'naver'
      }, httpClient, bridge);
      
      // 4. AuthManager 생성
      const authManager = new AuthManager(authConfig);
      
      // 5. 헬스 체크
      await this.performHealthCheck(authManager, bridge);
      
      // 6. 인스턴스 저장
      this.bridge = bridge;
      this.naverAuthManager = authManager;
      
      console.log('[ReactNativeAuthFactory] Naver AuthManager 생성 완료');
      return authManager;
      
    } catch (error) {
      console.error('[ReactNativeAuthFactory] Naver AuthManager 생성 실패:', error);
      throw error;
    }
  }

  /**
   * AuthManager 생성 및 초기화 (기존 호환성 유지)
   */
  static async createAuthManager(config: ReactNativeAuthConfig): Promise<AuthManager> {
    // 기본적으로 이메일 AuthManager 생성
    return this.createEmailAuthManager(config);
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
    let autoRefreshTimer: any = null;
    let mockTokenExpiresAt = 0; // 토큰 만료 시간 (Unix timestamp)
    
    // 세션 상태 업데이트 헬퍼 함수
    const updateSessionState = (userInfo: any) => {
      mockIsLoggedIn = true;
      mockUserInfo = userInfo;
      // 모의 토큰 만료 시간 설정 (1시간 후)
      mockTokenExpiresAt = Date.now() + (60 * 60 * 1000);
      console.log('[CustomMockBridge] 세션 상태 업데이트:', { 
        isLoggedIn: mockIsLoggedIn, 
        userInfo: mockUserInfo,
        tokenExpiresAt: new Date(mockTokenExpiresAt).toISOString()
      });
    };

    // 자동 토큰 갱신 로직
    const startAutoRefresh = () => {
      if (autoRefreshTimer) {
        clearInterval(autoRefreshTimer);
      }
      
      console.log('[CustomMockBridge] 🚀 자동 토큰 갱신 타이머 시작 (30초마다 체크)');
      
      // 30초마다 토큰 만료 시간 체크
      autoRefreshTimer = setInterval(() => {
        if (!mockIsLoggedIn || mockTokenExpiresAt === 0) {
          console.log('[CustomMockBridge] 🔍 토큰 체크 건너뜀 - 로그인되지 않음 또는 토큰 없음');
          return;
        }
        
        const now = Date.now();
        const timeUntilExpiry = mockTokenExpiresAt - now;
        const fiveMinutesInMs = 5 * 60 * 1000;
        const minutesUntilExpiry = Math.round(timeUntilExpiry / 1000 / 60);
        
        console.log(`[CustomMockBridge] 🔍 토큰 만료 시간 체크 - ${minutesUntilExpiry}분 남음 (${new Date(mockTokenExpiresAt).toLocaleTimeString()}에 만료)`);
        
        // 5분 전에 자동 갱신
        if (timeUntilExpiry <= fiveMinutesInMs && timeUntilExpiry > 0) {
          console.log('[CustomMockBridge] ⚡ 토큰 만료 5분 전, 자동 갱신 수행!');
          
          // 새로운 토큰 만료 시간 설정 (1시간 후)
          mockTokenExpiresAt = Date.now() + (60 * 60 * 1000);
          console.log(`[CustomMockBridge] ✅ 새로운 토큰 만료 시간: ${new Date(mockTokenExpiresAt).toLocaleTimeString()}`);
          
          // 토큰 갱신 이벤트 발생
          mockAuthListeners.forEach(listener => {
            try {
              listener('token_refreshed', {
                timestamp: Date.now(),
                source: 'auto_refresh',
                newExpiresAt: mockTokenExpiresAt
              });
            } catch (error) {
              console.error('[CustomMockBridge] 이벤트 리스너 오류:', error);
            }
          });
        } else if (timeUntilExpiry <= 0) {
          console.warn('[CustomMockBridge] ⚠️ 토큰이 이미 만료됨!');
        }
      }, 30000); // 30초마다 체크
    };

    const stopAutoRefresh = () => {
      if (autoRefreshTimer) {
        console.log('[CustomMockBridge] 자동 토큰 갱신 타이머 중지');
        clearInterval(autoRefreshTimer);
        autoRefreshTimer = null;
      }
    };
    
    return {
      isHealthy: async () => true,
      callWithAuth: async (request: any) => {
        console.log('[CustomMockBridge] API 호출:', request.url);
        console.log('[CustomMockBridge] 요청 전체:', request);
        
        // URL 체크 디버깅
        console.log('[CustomMockBridge] 로그아웃 URL 체크:', {
          url: request.url,
          includesLogout: request.url.includes('/api/v1/auth/members/logout'),
          urlType: typeof request.url
        });
        
        // 토큰 갱신 요청 처리
        if (request.url.includes('/auth/members/refresh')) {
          console.log('[CustomMockBridge] 토큰 갱신 처리');
          
          if (!mockIsLoggedIn) {
            return {
              success: false,
              status: 401,
              ok: false,
              data: { 
                success: false,
                message: "Unauthorized",
                error: "로그인이 필요합니다."
              },
              headers: {}
            };
          }
          
          // 만료 시간 갱신
          mockTokenExpiresAt = Date.now() + (60 * 60 * 1000);
          console.log(`[CustomMockBridge] API 호출로 토큰 갱신 - 새로운 만료 시간: ${new Date(mockTokenExpiresAt).toLocaleTimeString()}`);
          
          // 토큰 갱신 성공 이벤트 발생
          mockAuthListeners.forEach(listener => {
            try {
              listener('token_refreshed', {
                timestamp: Date.now(),
                source: 'mock_bridge',
                newExpiresAt: mockTokenExpiresAt
              });
            } catch (error) {
              console.error('[CustomMockBridge] 이벤트 리스너 오류:', error);
            }
          });
          
          return {
            success: true,
            status: 200,
            ok: true,
            data: { 
              success: true,
              message: "OK",
              data: {
                accessToken: 'mock-new-access-token-' + Date.now(),
                refreshToken: 'mock-new-refresh-token-' + Date.now(),
                expiresIn: 3600 // 1시간
              }
            },
            headers: {}
          };
        }

        // 이메일 로그아웃 요청 (우선 처리)
        if (request.url.includes('/api/v1/auth/members/logout')) {
          console.log('[CustomMockBridge] 이메일 로그아웃 처리');
          // 세션 초기화
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
          
          return {
            success: true,
            status: 200,
            ok: true,
            data: { 
              success: true,
              message: "OK",
              data: null
            },
            headers: {}
          };
        }
        
        // 이메일 인증번호 요청
        if (request.url.includes('/api/v1/auth/email/request')) {
          console.log('[CustomMockBridge] 이메일 인증번호 요청 처리');
          return {
            success: true,
            status: 200,
            ok: true,
            data: { 
              success: true,
              message: "OK",
              data: {
                message: '인증번호가 발송되었습니다.'
              }
            },
            headers: {}
          };
        }
        
        // 이메일 인증번호 확인
        if (request.url.includes('/api/v1/auth/email/verify')) {
          console.log('[CustomMockBridge] 이메일 인증번호 확인 처리');
          const body = request.body ? JSON.parse(request.body) : {};
          // 간단한 테스트를 위해 123456을 올바른 인증번호로 설정
          if (body.verifyCode === '123456') {
            return {
              success: true,
              status: 200,
              ok: true,
              data: { 
                success: true,
                message: "OK",
                data: {
                  message: '인증번호가 확인되었습니다.'
                }
              },
              headers: {}
            };
          } else {
            return {
              success: false,
              status: 400,
              ok: false,
              data: { 
                success: false,
                message: '인증번호가 올바르지 않습니다.',
                error: 'INVALID_VERIFICATION_CODE'
              },
              headers: {}
            };
          }
        }
        
        // 이메일 로그인
        if (request.url.includes('/api/v1/auth/members/email-login')) {
          console.log('[CustomMockBridge] 이메일 로그인 처리');
          const body = request.body ? JSON.parse(request.body) : {};
          // 인증번호가 123456인 경우 로그인 성공
          if (body.verifyCode === '123456') {
            const emailUserInfo = {
              sub: 'email-user-123',
              id: 'email-user-123',
              email: body.email,
              nickname: '이메일 사용자',
              provider: 'email'
            };
            
            // 세션 상태 업데이트
            updateSessionState(emailUserInfo);
            
            // 자동 토큰 갱신 시작
            startAutoRefresh();
            
            // 이메일 로그인 성공 이벤트 발생 (OAuth success와 동일)
            mockAuthListeners.forEach(listener => {
              try {
                listener('success', { user: emailUserInfo, provider: 'email' });
              } catch (error) {
                console.error('[CustomMockBridge] 이벤트 리스너 오류:', error);
              }
            });
            
            return {
              success: true,
              status: 200,
              ok: true,
              data: { 
                success: true,
                message: "OK",
                data: {
                  accessToken: 'mock-access-token',
                  refreshToken: 'mock-refresh-token',
                  user: emailUserInfo
                }
              },
              headers: {}
            };
          } else {
            return {
              success: false,
              status: 400,
              ok: false,
              data: { 
                success: false,
                message: '로그인에 실패했습니다.',
                error: 'INVALID_VERIFICATION_CODE'
              },
              headers: {}
            };
          }
        }

        // 구글 로그아웃 요청
        if (request.url.includes('/api/v1/auth/google/logout')) {
          console.log('[CustomMockBridge] 구글 로그아웃 처리');
          // 세션 초기화
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
          
          return {
            success: true,
            status: 200,
            ok: true,
            data: { 
              success: true,
              message: "OK",
              data: null
            },
            headers: {}
          };
        }
        
        
        // 다른 요청에 대한 기본 응답
        console.log('[CustomMockBridge] 기본 응답 처리');
        return {
          success: true,
          status: 200,
          ok: true,
          data: { 
            success: true,
            message: "OK",
            data: {
              message: 'Mock API 호출 성공'
            }
          },
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
          
          // Provider별로 다른 가짜 사용자 정보 생성
          const providerUserData = {
            google: {
              sub: 'google-user-123',
              id: 'google-user-123',
              email: 'google.user@gmail.com',
              nickname: '구글 사용자'
            },
            kakao: {
              sub: 'kakao-user-456',
              id: 'kakao-user-456',
              email: 'kakao.user@kakao.com',
              nickname: '카카오 사용자'
            },
            naver: {
              sub: 'naver-user-789',
              id: 'naver-user-789',
              email: 'naver.user@naver.com',
              nickname: '네이버 사용자'
            }
          };

          const userData = providerUserData[provider as keyof typeof providerUserData] || providerUserData.google;
          const oauthUserInfo = {
            ...userData,
            provider: provider
          };
          
          // 세션 상태 업데이트
          updateSessionState(oauthUserInfo);
          
          // 자동 토큰 갱신 시작
          startAutoRefresh();
          
          // OAuth 성공 이벤트 발생
          mockAuthListeners.forEach(listener => {
            try {
              listener('success', { user: oauthUserInfo, provider });
            } catch (error) {
              console.error('[CustomMockBridge] 이벤트 리스너 오료:', error);
            }
          });
        }, 1500);
        
        return { success: true };
      },
      getSession: async () => {
        console.log('[CustomMockBridge] 세션 정보 조회:', {
          isLoggedIn: mockIsLoggedIn,
          hasUserInfo: !!mockUserInfo
        });
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
        
        // 자동 토큰 갱신 중지
        stopAutoRefresh();
        
        // 상태 초기화
        mockIsLoggedIn = false;
        mockUserInfo = null;
        mockTokenExpiresAt = 0;
        
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
      refreshToken: async () => {
        console.log('[CustomMockBridge] 수동 토큰 갱신 요청');
        
        if (!mockIsLoggedIn) {
          console.warn('[CustomMockBridge] 로그인되지 않은 상태에서 토큰 갱신 시도');
          return false;
        }
        
        // 토큰 갱신 성공 시뮬레이션
        console.log('[CustomMockBridge] 수동 토큰 갱신 성공');
        
        // 새로운 토큰 만료 시간 설정 (1시간 후)
        mockTokenExpiresAt = Date.now() + (60 * 60 * 1000);
        
        // 토큰 갱신 성공 이벤트 발생
        mockAuthListeners.forEach(listener => {
          try {
            listener('token_refreshed', {
              timestamp: Date.now(),
              source: 'manual_refresh',
              newExpiresAt: mockTokenExpiresAt
            });
          } catch (error) {
            console.error('[CustomMockBridge] 이벤트 리스너 오류:', error);
          }
        });
        
        return true;
      },
      startAutoTokenRefresh: async () => {
        console.log('[CustomMockBridge] 자동 토큰 갱신 시작 요청');
        
        if (!mockIsLoggedIn) {
          console.warn('[CustomMockBridge] 로그인되지 않은 상태에서 자동 갱신 시작 불가');
          return false;
        }
        
        startAutoRefresh();
        return true;
      },
      stopAutoTokenRefresh: async () => {
        console.log('[CustomMockBridge] 자동 토큰 갱신 중지 요청');
        stopAutoRefresh();
        return true;
      },
      cleanup: () => {
        console.log('[CustomMockBridge] 정리');
        stopAutoRefresh();
        mockAuthListeners = [];
        mockIsLoggedIn = false;
        mockUserInfo = null;
        mockTokenExpiresAt = 0;
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
      providerType: config.provider === 'email' ? 'email' : 
                   config.provider === 'google' ? 'google' :
                   config.provider === 'kakao' ? 'kakao' : 
                   config.provider === 'naver' ? 'naver' : config.provider,
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
          refresh: '/auth/members/refresh',
          kakaoLogin: '/api/v1/auth/kakao/login',
          kakaoLogout: '/api/v1/auth/kakao/logout',
          kakaoRefresh: '/api/v1/auth/kakao/refresh',
          kakaoValidate: '/api/v1/auth/kakao/validate',
          kakaoUserinfo: '/api/v1/auth/kakao/userinfo',
          naverLogin: '/api/v1/auth/naver/login',
          naverLogout: '/api/v1/auth/naver/logout',
          naverRefresh: '/api/v1/auth/naver/refresh',
          naverValidate: '/api/v1/auth/naver/validate',
          naverUserinfo: '/api/v1/auth/naver/userinfo',
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

    if (config.provider === 'naver' && config.naverClientId) {
      baseConfig.providerConfig = {
        naverClientId: config.naverClientId
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
   * 현재 이메일 AuthManager 인스턴스 반환
   */
  static getCurrentEmailAuthManager(): AuthManager | null {
    return this.emailAuthManager;
  }

  /**
   * 현재 구글 AuthManager 인스턴스 반환
   */
  static getCurrentGoogleAuthManager(): AuthManager | null {
    return this.googleAuthManager;
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
    this.emailAuthManager = null;
    this.googleAuthManager = null;
    this.kakaoAuthManager = null;  
    this.naverAuthManager = null;  
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
 * 개발용 Mock AuthManager 초기화 (이메일용)
 */
export async function initializeMockEmailAuth(config: Partial<ReactNativeAuthConfig> = {}): Promise<AuthManager> {
  const mockConfig: ReactNativeAuthConfig = {
    provider: 'email',
    apiBaseUrl: 'https://api.example.com',
    useMockBridge: true,
    enableDebugLogs: true,
    ...config
  };
  return ReactNativeAuthFactory.createEmailAuthManager(mockConfig);
}

/**
 * 개발용 Mock AuthManager 초기화 (구글용)
 */
export async function initializeMockGoogleAuth(config: Partial<ReactNativeAuthConfig> = {}): Promise<AuthManager> {
  const mockConfig: ReactNativeAuthConfig = {
    provider: 'google',
    apiBaseUrl: 'https://api.example.com',
    googleClientId: 'mock-client-id-for-development',
    useMockBridge: true,
    enableDebugLogs: true,
    ...config
  };
  return ReactNativeAuthFactory.createGoogleAuthManager(mockConfig);
}

/**
 * 개발용 Mock AuthManager 초기화 (카카오용)
 */
export async function initializeMockKakaoAuth(config: Partial<ReactNativeAuthConfig> = {}): Promise<AuthManager> {
  const mockConfig: ReactNativeAuthConfig = {
    provider: 'kakao',
    apiBaseUrl: 'https://api.example.com',
    kakaoClientId: 'mock-client-id-for-development',
    useMockBridge: true,
    enableDebugLogs: true,
    ...config
  };
  return ReactNativeAuthFactory.createKakaoAuthManager(mockConfig);
}

/**
 * 개발용 Mock AuthManager 초기화 (네이버용)
 */
export async function initializeMockNaverAuth(config: Partial<ReactNativeAuthConfig> = {}): Promise<AuthManager> {
  const mockConfig: ReactNativeAuthConfig = {
    provider: 'naver',
    apiBaseUrl: 'https://api.example.com',
    naverClientId: 'mock-client-id-for-development',
    useMockBridge: true,
    enableDebugLogs: true,
    ...config
  };
  return ReactNativeAuthFactory.createNaverAuthManager(mockConfig);
}

/**
 * 개발용 Mock AuthManager 초기화 (기존 호환성 유지)
 */
export async function initializeMockAuth(config: Partial<ReactNativeAuthConfig> = {}): Promise<AuthManager> {
  // 기본적으로 이메일 AuthManager 반환
  return initializeMockEmailAuth(config);
}

/**
 * 기본 환경 설정
 */
export const defaultAuthConfig: Partial<ReactNativeAuthConfig> = {
  apiTimeout: 10000,
  enableDebugLogs: __DEV__,
  useMockBridge: __DEV__, // 개발 환경에서는 기본적으로 Mock 사용
};
