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
  
  // === Token Refresh ===
  refreshToken(): Promise<boolean>;
  startAutoTokenRefresh(): Promise<boolean>;
  stopAutoTokenRefresh(): Promise<boolean>;
  
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

  private handleNativeEvent = (eventNameOrPayload: any): void => {
    console.log(`[NativeAuthBridge] 네이티브 이벤트 수신:`, eventNameOrPayload);
    
    // 이벤트 payload 정규화
    const { eventName, data } = this.normalizeEventPayload(eventNameOrPayload);
    
    // 이벤트 이름 → AuthStatus 매핑
    const statusMap: Record<string, AuthStatus> = {
      'onAuthStarted': 'started',
      'onAuthCallbackReceived': 'callback_received', 
      'onAuthSuccess': 'success',
      'onAuthError': 'error',
      'onTokenRefreshed': 'token_refreshed',
      'onSignedOut': 'signed_out',
    };
    
    const status = eventName ? statusMap[eventName] : eventNameOrPayload.status;
    
    if (!status) {
      console.warn(`[NativeAuthBridge] 알 수 없는 이벤트:`, eventNameOrPayload);
      return;
    }
    
    this.notifyListeners(status, data);
  };

  /**
   * 네이티브 이벤트 payload 정규화
   * 플랫폼별로 다른 이벤트 형식을 통일된 형태로 변환
   */
  private normalizeEventPayload(eventNameOrPayload: any): { eventName?: string; data?: any } {
    // Case 1: { eventName: 'onAuthStarted', data: {...} } 형태
    if (eventNameOrPayload && typeof eventNameOrPayload === 'object' && eventNameOrPayload.eventName) {
      return {
        eventName: eventNameOrPayload.eventName,
        data: eventNameOrPayload.data
      };
    }
    
    // Case 2: { status: 'started', data: {...} } 형태 (기존 방식)
    if (eventNameOrPayload && typeof eventNameOrPayload === 'object' && eventNameOrPayload.status) {
      return {
        eventName: undefined,
        data: eventNameOrPayload.data
      };
    }
    
    // Case 3: 이벤트 이름만 전달된 경우 (문자열)
    if (typeof eventNameOrPayload === 'string') {
      return {
        eventName: eventNameOrPayload,
        data: undefined
      };
    }
    
    // Case 4: 기타 형태
    return {
      eventName: undefined,
      data: eventNameOrPayload
    };
  }

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
      
      // 네이티브 모듈 응답을 표준화 (success 필드 추가)
      const standardizedResponse = {
        success: response.success ?? (response.status >= 200 && response.status < 300),
        status: response.status,
        data: response.data,
        headers: response.headers || {},
        ...(response.error && { error: response.error })
      };
      
      return standardizedResponse;
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
   * 수동 토큰 갱신 요청 (M2(A): Native Refresh Call)
   * 네이티브가 refresh token을 사용하여 새로운 access token 발급
   */
  async refreshToken(): Promise<boolean> {
    console.log(`[NativeAuthBridge] 수동 토큰 갱신 요청`);
    
    try {
      if (!NativeAuthModule) {
        throw new Error('네이티브 모듈이 로드되지 않았습니다.');
      }

      if (!NativeAuthModule.refreshToken) {
        console.warn(`[NativeAuthBridge] refreshToken 메서드를 사용할 수 없습니다.`);
        return false;
      }

      const success = await NativeAuthModule.refreshToken();
      
      if (success) {
        console.log(`[NativeAuthBridge] 수동 토큰 갱신 성공`);
        // 토큰 갱신 성공 이벤트 발생
        this.notifyListeners('token_refreshed', { 
          timestamp: Date.now(),
          source: 'manual_refresh'
        });
      } else {
        console.warn(`[NativeAuthBridge] 수동 토큰 갱신 실패`);
      }
      
      return success;
    } catch (error) {
      console.error(`[NativeAuthBridge] 수동 토큰 갱신 오류:`, error);
      return false;
    }
  }

  /**
   * 자동 토큰 갱신 시작 (M2(A): Native Auto Refresh)
   * 네이티브가 토큰 만료 시간 모니터링하고 5분 전에 자동 갱신
   */
  async startAutoTokenRefresh(): Promise<boolean> {
    console.log(`[NativeAuthBridge] 자동 토큰 갱신 시작`);
    
    try {
      if (!NativeAuthModule) {
        throw new Error('네이티브 모듈이 로드되지 않았습니다.');
      }

      if (!NativeAuthModule.startAutoTokenRefresh) {
        console.warn(`[NativeAuthBridge] startAutoTokenRefresh 메서드를 사용할 수 없습니다.`);
        return false;
      }

      const success = await NativeAuthModule.startAutoTokenRefresh();
      
      if (success) {
        console.log(`[NativeAuthBridge] 자동 토큰 갱신 시작됨`);
      } else {
        console.warn(`[NativeAuthBridge] 자동 토큰 갱신 시작 실패`);
      }
      
      return success;
    } catch (error) {
      console.error(`[NativeAuthBridge] 자동 토큰 갱신 시작 오류:`, error);
      return false;
    }
  }

  /**
   * 자동 토큰 갱신 중지 (M2(A): Native Auto Refresh)
   * 네이티브의 자동 토큰 갱신 타이머 중지
   */
  async stopAutoTokenRefresh(): Promise<boolean> {
    console.log(`[NativeAuthBridge] 자동 토큰 갱신 중지`);
    
    try {
      if (!NativeAuthModule) {
        throw new Error('네이티브 모듈이 로드되지 않았습니다.');
      }

      if (!NativeAuthModule.stopAutoTokenRefresh) {
        console.warn(`[NativeAuthBridge] stopAutoTokenRefresh 메서드를 사용할 수 없습니다.`);
        return false;
      }

      const success = await NativeAuthModule.stopAutoTokenRefresh();
      
      if (success) {
        console.log(`[NativeAuthBridge] 자동 토큰 갱신 중지됨`);
      } else {
        console.warn(`[NativeAuthBridge] 자동 토큰 갱신 중지 실패`);
      }
      
      return success;
    } catch (error) {
      console.error(`[NativeAuthBridge] 자동 토큰 갱신 중지 오류:`, error);
      return false;
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
