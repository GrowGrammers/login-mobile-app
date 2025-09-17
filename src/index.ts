/**
 * Login Mobile App - Main Entry Point
 * React Native용 Auth-Core 연동 데모 앱
 */

// === Bridge 구현체 ===
export { NativeAuthBridge } from './bridge/NativeAuthModule';

// === Auth 설정 및 팩토리 ===
export { 
  ReactNativeAuthFactory,
  initializeAuth,
  initializeMockAuth,
  initializeMockEmailAuth,
  initializeMockGoogleAuth,
  defaultAuthConfig
} from './auth/AuthConfig';
export type { ReactNativeAuthConfig } from './auth/AuthConfig';

// === HTTP 클라이언트 ===
export { ReactNativeHttpClient } from './auth/ReactNativeHttpClient';

// === 이벤트 핸들링 및 상태 관리 ===
export { 
  useAuthState,
  AuthActions,
  AuthEventLogger
} from './utils/AuthEventHandler';
export type { AuthState } from './utils/AuthEventHandler';

// === UI 컴포넌트 ===
export { LoginButton, LogoutButton } from './components/LoginButton';

// === 화면 컴포넌트 ===
export { EmailInputScreen } from './screens/EmailInputScreen';
export { VerificationCodeScreen } from './screens/VerificationCodeScreen';

// === Auth-Core Re-exports (편의를 위한) ===
export type { 
  AuthManager,
  ReactNativeBridge,
  AuthStatus,
  OAuthProvider,
  SessionInfo,
  AuthenticatedRequest,
  AuthenticatedResponse,
  MockReactNativeBridge
} from '@growgrammers/auth-core';