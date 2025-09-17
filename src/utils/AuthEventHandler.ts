/**
 * 인증 이벤트 핸들링 및 상태 관리 유틸리티
 * Native → RN 이벤트 처리 및 UI 상태 동기화
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { AuthStatus, ReactNativeBridge, SessionInfo } from '@growgrammers/auth-core';
import type { AuthManager } from '@growgrammers/auth-core';

/**
 * 인증 상태 타입 정의
 */
export interface AuthState {
  // === 로그인 상태 ===
  isLoggedIn: boolean;
  isLoading: boolean;
  
  // === 사용자 정보 ===
  userInfo: SessionInfo['userInfo'] | null;
  
  // === OAuth 플로우 상태 ===
  isOAuthInProgress: boolean;
  oauthProvider: string | null;
  
  // === 에러 상태 ===
  error: string | null;
  
  // === 최근 이벤트 ===
  lastEvent: {
    status: AuthStatus;
    timestamp: number;
    data?: any;
  } | null;
}

/**
 * 초기 인증 상태
 */
const initialAuthState: AuthState = {
  isLoggedIn: false,
  isLoading: false,
  userInfo: null,
  isOAuthInProgress: false,
  oauthProvider: null,
  error: null,
  lastEvent: null,
};

/**
 * React Hook: 인증 상태 관리
 * Native 이벤트를 구독하고 React 상태와 동기화
 */
export function useAuthState(authManager: AuthManager | null): {
  authState: AuthState;
  refreshSession: () => Promise<void>;
  clearError: () => void;
} {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const bridgeRef = useRef<ReactNativeBridge | null>(null);

  // === 이벤트 핸들러 ===
  
  const handleAuthEvent = useCallback((status: AuthStatus, data?: any) => {
    console.log('[AuthEventHandler] 이벤트 수신:', status, data);
    
    const timestamp = Date.now();
    
    setAuthState(prevState => {
      const newState = { ...prevState };
      
      // 최근 이벤트 업데이트
      newState.lastEvent = { status, timestamp, data };
      
      // 상태별 처리
      switch (status) {
        case 'started':
          newState.isOAuthInProgress = true;
          newState.oauthProvider = data?.provider || null;
          newState.isLoading = true;
          newState.error = null;
          break;
          
        case 'callback_received':
          newState.isLoading = true;
          break;
          
        case 'success':
          newState.isLoggedIn = true;
          newState.isOAuthInProgress = false;
          newState.isLoading = false;
          newState.error = null;
          if (data?.user) {
            newState.userInfo = data.user;
          }
          break;
          
        case 'error':
          newState.isOAuthInProgress = false;
          newState.isLoading = false;
          newState.error = data?.error || '인증 오류가 발생했습니다.';
          break;
          
        case 'token_refreshed':
          // 토큰 갱신은 백그라운드에서 처리되므로 UI 상태는 유지
          break;
          
        case 'signed_out':
          newState.isLoggedIn = false;
          newState.userInfo = null;
          newState.isOAuthInProgress = false;
          newState.isLoading = false;
          newState.error = null;
          newState.oauthProvider = null;
          break;
      }
      
      return newState;
    });
  }, []);

  // === 세션 상태 새로고침 ===
  
  const refreshSession = useCallback(async () => {
    if (!authManager) return;
    
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const session = await authManager.getCurrentSession();
      
      setAuthState(prev => ({
        ...prev,
        isLoggedIn: session?.isLoggedIn || false,
        userInfo: session?.userInfo || null,
        isLoading: false,
        error: null
      }));
      
    } catch (err) {
      console.error('[AuthEventHandler] 세션 새로고침 실패:', err);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : '세션 조회 실패'
      }));
    }
  }, [authManager]);

  // === 에러 정리 ===
  
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // === 이펙트: 이벤트 리스너 등록 ===
  
  useEffect(() => {
    if (!authManager) return;
    
    const bridge = authManager.getNativeBridge();
    if (!bridge) {
      console.warn('[AuthEventHandler] Native Bridge를 찾을 수 없습니다.');
      return;
    }
    
    bridgeRef.current = bridge;
    
    // 이벤트 리스너 등록
    bridge.addAuthStatusListener(handleAuthEvent);
    
    // 초기 세션 상태 로드
    refreshSession();
    
    // 정리 함수
    return () => {
      if (bridgeRef.current) {
        bridgeRef.current.removeAuthStatusListener(handleAuthEvent);
      }
    };
  }, [authManager, handleAuthEvent, refreshSession]);

  return {
    authState,
    refreshSession,
    clearError,
  };
}

/**
 * 인증 액션 헬퍼 클래스
 * 공통적으로 사용되는 인증 관련 액션들을 모아둠
 */
export class AuthActions {
  private authManager: AuthManager;
  private onStateChange?: (state: Partial<AuthState>) => void;
  private currentProvider: 'email' | 'google' | 'fake' = 'email';

  constructor(authManager: AuthManager, onStateChange?: (state: Partial<AuthState>) => void) {
    this.authManager = authManager;
    this.onStateChange = onStateChange;
  }

  /**
   * OAuth 로그인 시작
   */
  async startOAuth(provider: 'google' | 'kakao'): Promise<boolean> {
    try {
      console.log(`[AuthActions] OAuth 로그인 시작: ${provider}`);
      
      // provider 저장 (google만 지원)
      this.currentProvider = provider === 'google' ? 'google' : 'email';
      
      this.notifyStateChange({ 
        isLoading: true, 
        error: null,
        isOAuthInProgress: true,
        oauthProvider: provider
      });
      
      const result = await this.authManager.startNativeOAuth(provider);
      
      if (result.success) {
        console.log(`[AuthActions] OAuth 로그인 시작 성공`);
        return true;
      } else {
        const error = result.message || 'OAuth 시작 실패';
        console.error(`[AuthActions] OAuth 로그인 시작 실패:`, error);
        
        this.notifyStateChange({ 
          isLoading: false,
          isOAuthInProgress: false,
          error 
        });
        return false;
      }
    } catch (error) {
      console.error(`[AuthActions] OAuth 로그인 예외:`, error);
      
      this.notifyStateChange({ 
        isLoading: false,
        isOAuthInProgress: false,
        error: error instanceof Error ? error.message : 'OAuth 로그인 실패'
      });
      return false;
    }
  }

  /**
   * 로그아웃
   */
  async signOut(): Promise<boolean> {
    try {
      console.log(`[AuthActions] 로그아웃 시작`);
      
      this.notifyStateChange({ isLoading: true, error: null });
      
      const result = await this.authManager.logout({ provider: this.currentProvider });
      
      if (result.success) {
        console.log(`[AuthActions] 로그아웃 성공`);
        
        this.notifyStateChange({ 
          isLoggedIn: false,
          userInfo: null,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        const error = result.message || '로그아웃 실패';
        console.error(`[AuthActions] 로그아웃 실패:`, error);
        
        this.notifyStateChange({ 
          isLoading: false,
          error 
        });
        return false;
      }
    } catch (error) {
      console.error(`[AuthActions] 로그아웃 예외:`, error);
      
      this.notifyStateChange({ 
        isLoading: false,
        error: error instanceof Error ? error.message : '로그아웃 실패'
      });
      return false;
    }
  }

  /**
   * 보호된 API 호출
   */
  async callProtectedAPI(config: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
  }): Promise<any> {
    try {
      console.log(`[AuthActions] 보호된 API 호출:`, config.method, config.url);
      
      const result = await this.authManager.callProtectedAPI({
        url: config.url,
        method: config.method,
        headers: config.headers,
        body: config.body ? JSON.stringify(config.body) : undefined
      });
      
      console.log(`[AuthActions] API 호출 성공`);
      return result;
    } catch (error) {
      console.error(`[AuthActions] API 호출 실패:`, error);
      throw error;
    }
  }

  /**
   * 세션 새로고침
   */
  async refreshSession(): Promise<SessionInfo | null> {
    try {
      console.log(`[AuthActions] 세션 새로고침`);
      
      const session = await this.authManager.getCurrentSession();
      
      this.notifyStateChange({
        isLoggedIn: session?.isLoggedIn || false,
        userInfo: session?.userInfo || null
      });
      
      return session;
    } catch (error) {
      console.error(`[AuthActions] 세션 새로고침 실패:`, error);
      
      this.notifyStateChange({
        error: error instanceof Error ? error.message : '세션 조회 실패'
      });
      return null;
    }
  }

  /**
   * 상태 변경 알림
   */
  private notifyStateChange(state: Partial<AuthState>): void {
    if (this.onStateChange) {
      this.onStateChange(state);
    }
  }
}

/**
 * 인증 이벤트 로깅 유틸리티
 */
export class AuthEventLogger {
  private static logs: Array<{
    timestamp: number;
    status: AuthStatus;
    data?: any;
    message: string;
  }> = [];

  static log(status: AuthStatus, data?: any, customMessage?: string): void {
    const timestamp = Date.now();
    const message = customMessage || this.getDefaultMessage(status, data);
    
    const logEntry = { timestamp, status, data, message };
    this.logs.push(logEntry);
    
    // 최근 100개 로그만 유지
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }
    
    console.log(`[AuthEventLogger] ${message}`, data);
  }

  static getLogs(): typeof AuthEventLogger.logs {
    return [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
  }

  private static getDefaultMessage(status: AuthStatus, data?: any): string {
    switch (status) {
      case 'started':
        return `OAuth 로그인 시작 (${data?.provider || 'unknown'})`;
      case 'callback_received':
        return 'OAuth 콜백 수신';
      case 'success':
        return 'OAuth 로그인 성공';
      case 'error':
        return `OAuth 오류: ${data?.error || 'unknown'}`;
      case 'token_refreshed':
        return '토큰 갱신 완료';
      case 'signed_out':
        return '로그아웃 완료';
      default:
        return `인증 이벤트: ${status}`;
    }
  }
}
