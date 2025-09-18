/**
 * React Native용 HttpClient 구현체
 * ReactNativeBridge를 통해 네이티브에서 보호된 API 호출 대리
 * 
 * M2(A) 패턴: 
 * - 네이티브가 토큰 관리 (Access + Refresh)
 * - 네이티브가 Authorization 헤더 주입
 * - 네이티브가 401 재시도 처리
 * - RN은 단순히 요청만 전달
 */

import type { HttpClient, HttpRequestConfig, HttpResponse, JsonBody } from '@growgrammers/auth-core';
import type { ReactNativeBridge } from '@growgrammers/auth-core';

/**
 * ReactNativeBridge 기반 HttpClient 구현체
 * auth-core의 HttpClient 인터페이스를 구현하여 AuthManager에 주입
 */
export class ReactNativeHttpClient implements HttpClient {
  private nativeBridge: ReactNativeBridge;

  constructor(nativeBridge: ReactNativeBridge) {
    this.nativeBridge = nativeBridge;
  }

  /**
   * HTTP 요청 실행
   * ReactNativeBridge를 통해 네이티브에서 대리 호출
   */
  async request(config: HttpRequestConfig): Promise<HttpResponse> {
    console.log(`[ReactNativeHttpClient] HTTP 요청:`, {
      method: config.method,
      url: config.url,
      hasHeaders: !!config.headers,
      hasBody: !!config.body
    });

    try {
      // 요청 변환: auth-core 형식 → ReactNativeBridge 형식
      const bridgeRequest = this.transformToBridgeRequest(config);
      
      // 네이티브 Bridge를 통한 대리 호출
      const bridgeResponse = await this.nativeBridge.callWithAuth(bridgeRequest);
      
      // 응답 변환: ReactNativeBridge 형식 → auth-core 형식
      const httpResponse = this.transformToHttpResponse(bridgeResponse);
      
      console.log(`[ReactNativeHttpClient] HTTP 응답:`, {
        status: httpResponse.status,
        ok: httpResponse.ok,
        hasData: !!bridgeResponse.data
      });

      return httpResponse;
    } catch (error) {
      console.error(`[ReactNativeHttpClient] HTTP 요청 실패:`, error);
      
      // 에러를 HttpResponse 형태로 변환
      return this.createErrorResponse(error);
    }
  }

  // === 요청/응답 변환 유틸리티 ===

  /**
   * auth-core HttpRequestConfig → ReactNativeBridge AuthenticatedRequest
   */
  private transformToBridgeRequest(config: HttpRequestConfig) {
    return {
      url: config.url,
      method: config.method as any, // GET | POST | PUT | DELETE | PATCH
      headers: config.headers,
      body: this.serializeBody(config.body),
      timeout: config.timeout
    };
  }

  /**
   * ReactNativeBridge AuthenticatedResponse → auth-core HttpResponse
   */
  private transformToHttpResponse(bridgeResponse: any): HttpResponse {
    const isOk = bridgeResponse.success && bridgeResponse.status >= 200 && bridgeResponse.status < 300;
    
    return {
      ok: isOk,
      status: bridgeResponse.status || 200,
      statusText: this.getStatusText(bridgeResponse.status),
      headers: bridgeResponse.headers || {},
      
      // JSON 파싱 메서드
      json: async () => {
        if (bridgeResponse.data && typeof bridgeResponse.data === 'object') {
          return bridgeResponse.data;
        }
        
        // 문자열인 경우 JSON 파싱 시도
        if (typeof bridgeResponse.data === 'string') {
          try {
            return JSON.parse(bridgeResponse.data);
          } catch {
            throw new Error('응답이 유효한 JSON이 아닙니다.');
          }
        }
        
        // 에러 응답 처리
        if (!bridgeResponse.success && bridgeResponse.error) {
          throw new Error(bridgeResponse.error);
        }
        
        return bridgeResponse.data || {};
      },
      
      // 텍스트 파싱 메서드
      text: async () => {
        if (typeof bridgeResponse.data === 'string') {
          return bridgeResponse.data;
        }
        
        if (bridgeResponse.data && typeof bridgeResponse.data === 'object') {
          return JSON.stringify(bridgeResponse.data);
        }
        
        if (!bridgeResponse.success && bridgeResponse.error) {
          return bridgeResponse.error;
        }
        
        return bridgeResponse.data?.toString() || '';
      }
    };
  }

  /**
   * HTTP 상태 코드 → 상태 텍스트 변환
   */
  private getStatusText(status: number): string {
    const statusTexts: Record<number, string> = {
      200: 'OK',
      201: 'Created',
      204: 'No Content',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable'
    };
    
    return statusTexts[status] || 'Unknown';
  }

  /**
   * 요청 본문 직렬화
   */
  private serializeBody(body: JsonBody | FormData | Blob | ArrayBuffer | ArrayBufferView | undefined): string | undefined {
    if (!body) {
      return undefined;
    }

    // 이미 문자열인 경우
    if (typeof body === 'string') {
      return body;
    }

    // JSON 객체인 경우
    if (typeof body === 'object' && body !== null) {
      // FormData, Blob 등은 네이티브에서 직접 처리해야 함
      if (body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer) {
        console.warn('[ReactNativeHttpClient] FormData/Blob/ArrayBuffer는 현재 지원되지 않습니다. 네이티브 구현이 필요합니다.');
        return JSON.stringify({ error: 'Unsupported body type' });
      }

      // 일반 객체/배열은 JSON 직렬화
      try {
        return JSON.stringify(body);
      } catch (error) {
        console.error('[ReactNativeHttpClient] JSON 직렬화 실패:', error);
        return undefined;
      }
    }

    return undefined;
  }

  /**
   * 에러를 HttpResponse로 변환
   */
  private createErrorResponse(error: any): HttpResponse {
    const status = error.status || 500;
    const message = error.message || '알 수 없는 오류';
    
    return {
      ok: false,
      status,
      statusText: this.getStatusText(status),
      headers: {},
      
      json: async () => {
        throw new Error(message);
      },
      
      text: async () => {
        return message;
      }
    };
  }

  // === 디버깅 및 헬스 체크 ===

  /**
   * Bridge 연결 상태 확인
   */
  async isHealthy(): Promise<boolean> {
    try {
      // ReactNativeBridge에 헬스 체크 메서드가 있다면 사용
      if ('isHealthy' in this.nativeBridge && typeof this.nativeBridge.isHealthy === 'function') {
        return await this.nativeBridge.isHealthy();
      }

      // 기본적으로 getSession 호출로 연결 상태 확인
      await this.nativeBridge.getSession();
      return true;
    } catch (error) {
      console.error('[ReactNativeHttpClient] 헬스 체크 실패:', error);
      return false;
    }
  }

  /**
   * Bridge 객체 반환 (디버깅용)
   */
  getBridge(): ReactNativeBridge {
    return this.nativeBridge;
  }
}
