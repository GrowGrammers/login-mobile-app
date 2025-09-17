/**
 * React Native Native Module Bridge
 * A1 + M2(A) 패턴을 위한 네이티브 모듈 래퍼
 * 
 * A1: Custom Tabs + Deep Link + PKCE (Native에서 처리)
 * M2(A): Native가 토큰 관리, RN은 API 대리호출만 요청
 */

import { NativeModules, DeviceEventEmitter, NativeEventEmitter, Platform } from 'react-native';
import type { 
  ReactNativeBridge, 
  AuthStatus, 
  OAuthProvider, 
  SessionInfo, 
  AuthenticatedRequest, 
  AuthenticatedResponse 
} from '@growgrammers/auth-core';

// 네이티브 모듈 인터페이스 정의
interface NativeAuthModuleInterface {
  // === A1: Custom Tabs OAuth Flow ===
  startOAuth(provider: string): Promise<boolean>;
  
  // === M2(A): Token Management by Native ===
  getSession(): Promise<SessionInfo>;
  signOut(): Promise<boolean>;
  callWithAuth(
    url: string,
    method: string,
    headers?: Record<string, string>,
    body?: string,
    timeout?: number
  ): Promise<AuthenticatedResponse>;
  
  // === Optional: Direct Token Access (Less Secure) ===
  getAuthHeader?(): Promise<string | null>;
  
  // === Health Check ===
  isModuleReady(): Promise<boolean>;
}

// 네이티브 모듈 가져오기
const NativeAuthModule = NativeModules.NativeAuthModule as NativeAuthModuleInterface;

/**
 * ReactNativeBridge 구현체
 * 네이티브 모듈과 auth-core 사이의 Bridge 역할
 */
export class NativeAuthBridge implements ReactNativeBridge {
  private eventEmitter: NativeEventEmitter | null = null;
  private listeners: Array<(status: AuthStatus, data?: any) => void> = [];
  private subscriptions: any[] = [];

  constructor() {
    this.initializeEventEmitter();
    this.setupEventListeners();
  }

  // === 이벤트 시스템 초기화 ===
  
  private initializeEventEmitter(): void {
    if (Platform.OS === 'ios' && NativeAuthModule) {
      this.eventEmitter = new NativeEventEmitter(NativeAuthModule as any);
    }
    // Android는 DeviceEventEmitter 사용
  }

  private setupEventListeners(): void {
    // 이벤트 타입 정의
    const eventTypes = [
      'onAuthStarted',
      'onAuthCallbackReceived', 
      'onAuthSuccess',
      'onAuthError',
      'onTokenRefreshed',
      'onSignedOut'
    ];

    eventTypes.forEach(eventType => {
      let subscription;
      
      if (Platform.OS === 'ios' && this.eventEmitter) {
        // iOS: NativeEventEmitter 사용
        subscription = this.eventEmitter.addListener(eventType, this.handleNativeEvent.bind(this));
      } else {
        // Android: DeviceEventEmitter 사용
        subscription = DeviceEventEmitter.addListener(eventType, this.handleNativeEvent.bind(this));
      }
      
      this.subscriptions.push(subscription);
    });
  }

  private handleNativeEvent = (event: { status: AuthStatus; data?: any }): void => {
    console.log(`[NativeAuthBridge] 네이티브 이벤트 수신:`, event);
    this.notifyListeners(event.status, event.data); // React 컴포넌트에게 이벤트 알림 전달
  };

  // === ReactNativeBridge 인터페이스 구현 ===

  /**
   * OAuth 로그인 시작 (A1: Custom Tabs + PKCE)
   */
  async startOAuth(provider: OAuthProvider): Promise<boolean> {
    console.log(`[NativeAuthBridge] OAuth 시작: ${provider}`);
    
    try {
      if (!NativeAuthModule) {
        throw new Error('네이티브 모듈이 로드되지 않았습니다.');
      }

      const result = await NativeAuthModule.startOAuth(provider); // 네이티브 모듈의 startOAuth 메서드 호출
      console.log(`[NativeAuthBridge] OAuth 시작 결과:`, result);
      return result;
    } catch (error) {
      console.error(`[NativeAuthBridge] OAuth 시작 실패:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.notifyListeners('error', { error: errorMessage, provider });
      return false;
    }
  }

  /**
   * 세션 정보 조회 (M2(A): Native Token Management)
   */
  async getSession(): Promise<SessionInfo> {
    console.log(`[NativeAuthBridge] 세션 정보 조회`);
    
    try {
      if (!NativeAuthModule) {
        throw new Error('네이티브 모듈이 로드되지 않았습니다.');
      }

      const session = await NativeAuthModule.getSession();
      console.log(`[NativeAuthBridge] 세션 정보:`, session);
      return session;
    } catch (error) {
      console.error(`[NativeAuthBridge] 세션 조회 실패:`, error);
      return { isLoggedIn: false };
    }
  }

  /**
   * 로그아웃 (M2(A): Native Token Clear)
   */
  async signOut(): Promise<boolean> {
    console.log(`[NativeAuthBridge] 로그아웃 요청`);
    
    try {
      if (!NativeAuthModule) {
        throw new Error('네이티브 모듈이 로드되지 않았습니다.');
      }

      const result = await NativeAuthModule.signOut();
      console.log(`[NativeAuthBridge] 로그아웃 결과:`, result);
      return result;
    } catch (error) {
      console.error(`[NativeAuthBridge] 로그아웃 실패:`, error);
      return false;
    }
  }

  /**
   * 보호된 API 대리호출 (M2(A): Native Proxy Call)
   * 네이티브가 토큰 주입, 갱신, 401 재시도 모두 처리
   */
  async callWithAuth(request: AuthenticatedRequest): Promise<AuthenticatedResponse> {
    console.log(`[NativeAuthBridge] 보호된 API 대리호출:`, request);
    
    try {
      if (!NativeAuthModule) {
        throw new Error('네이티브 모듈이 로드되지 않았습니다.');
      }

      const response = await NativeAuthModule.callWithAuth(
        request.url,
        request.method,
        request.headers,
        request.body,
        request.timeout
      );
      
      console.log(`[NativeAuthBridge] API 응답:`, response);
      return response;
    } catch (error) {
      console.error(`[NativeAuthBridge] API 호출 실패:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        status: 500,
        headers: {},
        error: errorMessage
      };
    }
  }

  /**
   * Authorization 헤더만 조회 (선택적, 덜 안전)
   */
  async getAuthHeader(): Promise<string | null> {
    console.log(`[NativeAuthBridge] Authorization 헤더 조회`);
    
    try {
      if (!NativeAuthModule?.getAuthHeader) {
        console.warn(`[NativeAuthBridge] getAuthHeader 메서드가 구현되지 않음`);
        return null;
      }

      const header = await NativeAuthModule.getAuthHeader();
      console.log(`[NativeAuthBridge] Authorization 헤더:`, header ? '*** (숨김)' : 'null');
      return header;
    } catch (error) {
      console.error(`[NativeAuthBridge] 헤더 조회 실패:`, error);
      return null;
    }
  }

  // === 이벤트 리스너 관리 ===

  addAuthStatusListener(listener: (status: AuthStatus, data?: any) => void): void {
    this.listeners.push(listener);
    console.log(`[NativeAuthBridge] 이벤트 리스너 등록 (총 ${this.listeners.length}개)`);
  }

  removeAuthStatusListener(listener: (status: AuthStatus, data?: any) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
      console.log(`[NativeAuthBridge] 이벤트 리스너 제거 (총 ${this.listeners.length}개)`);
    }
  }

  private notifyListeners(status: AuthStatus, data?: any): void {
    console.log(`[NativeAuthBridge] 이벤트 알림: ${status}`, data);
    this.listeners.forEach(listener => {
      try {
        listener(status, data);
      } catch (error) {
        console.error('[NativeAuthBridge] 이벤트 리스너 오류:', error);
      }
    });
  }

  // === 헬스 체크 ===

  /**
   * 네이티브 모듈 상태 확인
   */
  async isHealthy(): Promise<boolean> {
    try {
      if (!NativeAuthModule) {
        console.warn(`[NativeAuthBridge] 네이티브 모듈이 로드되지 않음`);
        return false;
      }

      if (!NativeAuthModule.isModuleReady) {
        console.warn(`[NativeAuthBridge] isModuleReady 메서드가 구현되지 않음`);
        return true; // 기본적으로 사용 가능한 것으로 간주
      }

      const isReady = await NativeAuthModule.isModuleReady();
      console.log(`[NativeAuthBridge] 모듈 상태: ${isReady ? '정상' : '비정상'}`);
      return isReady;
    } catch (error) {
      console.error(`[NativeAuthBridge] 헬스 체크 실패:`, error);
      return false;
    }
  }

  // === 정리 ===

  /**
   * Bridge 정리 (컴포넌트 언마운트 시 호출)
   */
  cleanup(): void {
    console.log(`[NativeAuthBridge] Bridge 정리 시작`);
    
    // 이벤트 구독 해제
    this.subscriptions.forEach(subscription => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    });
    this.subscriptions = [];
    
    // 리스너 정리
    this.listeners = [];
    
    console.log(`[NativeAuthBridge] Bridge 정리 완료`);
  }
}
