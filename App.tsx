/**
 * Login Mobile App - React Native Demo
 * Auth-Core 연동 데모 앱
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  useColorScheme, 
  View, 
  Text, 
  ActivityIndicator 
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// auth-core 관련 import
import { AuthManager } from '@growgrammers/auth-core';
import { 
  initializeMockEmailAuth, 
  initializeMockGoogleAuth, 
  initializeMockKakaoAuth, 
  initializeMockNaverAuth, 
  useAuthState, 
  AuthActions 
} from './src';
import { LoginButton, LogoutButton } from './src/components/LoginButton';
import { EmailInputScreen } from './src/screens/EmailInputScreen';
import { VerificationCodeScreen } from './src/screens/VerificationCodeScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AuthApp />
    </SafeAreaProvider>
  );
}

function AuthApp() {
  const safeAreaInsets = useSafeAreaInsets();
  const [emailAuthManager, setEmailAuthManager] = useState<AuthManager | null>(null);
  const [googleAuthManager, setGoogleAuthManager] = useState<AuthManager | null>(null);
  const [kakaoAuthManager, setKakaoAuthManager] = useState<AuthManager | null>(null);
  const [naverAuthManager, setNaverAuthManager] = useState<AuthManager | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  // AuthManager들 초기화
  useEffect(() => {
    console.log('[App] AuthManager들 초기화 시작...');
    
    Promise.all([
      // 이메일 AuthManager 초기화
      initializeMockEmailAuth({
        apiBaseUrl: 'https://api.example.com',
        useMockBridge: true,
        enableDebugLogs: true
      }),
      // 구글 AuthManager 초기화
      initializeMockGoogleAuth({
        apiBaseUrl: 'https://api.example.com',
        googleClientId: 'mock-client-id-for-development',
        useMockBridge: true,
        enableDebugLogs: true
      }),
      // 카카오 AuthManager 초기화
      initializeMockKakaoAuth({
        apiBaseUrl: 'https://api.example.com',
        kakaoClientId: 'mock-client-id-for-development',
        useMockBridge: true,
        enableDebugLogs: true
      }),
      // 네이버 AuthManager 초기화
      initializeMockNaverAuth({
        apiBaseUrl: 'https://api.example.com',
        naverClientId: 'mock-client-id-for-development',
        useMockBridge: true,
        enableDebugLogs: true
      })
    ])
    .then(([emailManager, googleManager, kakaoManager, naverManager]) => {
      console.log('[App] AuthManager들 초기화 성공!');
      setEmailAuthManager(emailManager);
      setGoogleAuthManager(googleManager);
      setKakaoAuthManager(kakaoManager);
      setNaverAuthManager(naverManager);
    })
    .catch((error) => {
      console.error('[App] AuthManager 초기화 실패:', error);
      setInitError(error.message || '초기화 실패');
    });
  }, []);

  // 로딩 상태
  if ((!emailAuthManager || !googleAuthManager || !kakaoAuthManager || !naverAuthManager) && !initError) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Auth 시스템 초기화 중...</Text>
      </View>
    );
  }

  // 에러 상태
  if (initError) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>⚠️ 초기화 오류</Text>
        <Text style={styles.errorMessage}>{initError}</Text>
      </View>
    );
  }

  // 정상 상태 - 실제 앱 렌더링
  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <LoginMobileApp 
        emailAuthManager={emailAuthManager!} 
        googleAuthManager={googleAuthManager!}
        kakaoAuthManager={kakaoAuthManager!}
        naverAuthManager={naverAuthManager!}
      />
    </View>
  );
}

// 화면 타입 정의
type ScreenType = 'login' | 'email-input' | 'verification-code';

// 메인 로그인 앱 컴포넌트
function LoginMobileApp({ 
  emailAuthManager, 
  googleAuthManager,
  kakaoAuthManager,
  naverAuthManager 
}: { 
  emailAuthManager: AuthManager;
  googleAuthManager: AuthManager;
  kakaoAuthManager: AuthManager;
  naverAuthManager: AuthManager;
}) {
  // 현재 사용 중인 AuthManager 상태 관리
  const [currentAuthManager, setCurrentAuthManager] = useState<AuthManager>(emailAuthManager);
  const [currentProvider, setCurrentProvider] = useState<'email' | 'google' | 'kakao' | 'naver'>('email');
  
  const { authState, clearError, refreshSession } = useAuthState(currentAuthManager);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [emailForVerification, setEmailForVerification] = useState<string>('');
  
  // AuthActions 인스턴스 생성 (현재 AuthManager 기준)
  const authActions = new AuthActions(currentAuthManager);

  console.log('[App] 현재 인증 상태:', authState);
  console.log('[App] 현재 화면:', currentScreen);

  // 구글 AuthManager로 전환
  const switchToGoogleAuth = () => {
    if (currentProvider !== 'google') {
      console.log('[App] 구글 AuthManager로 전환');
      setCurrentAuthManager(googleAuthManager);
      setCurrentProvider('google');
    }
  };

  // 이메일 AuthManager로 전환
  const switchToEmailAuth = () => {
    if (currentProvider !== 'email') {
      console.log('[App] 이메일 AuthManager로 전환');
      setCurrentAuthManager(emailAuthManager);
      setCurrentProvider('email');
    }
  };

  // 카카오 AuthManager로 전환
  const switchToKakaoAuth = () => {
    if (currentProvider !== 'kakao') {
      console.log('[App] 카카오 AuthManager로 전환');
      setCurrentAuthManager(kakaoAuthManager);
      setCurrentProvider('kakao');
    }
  };

  // 네이버 AuthManager로 전환
  const switchToNaverAuth = () => {
    if (currentProvider !== 'naver') {
      console.log('[App] 네이버 AuthManager로 전환');
      setCurrentAuthManager(naverAuthManager);
      setCurrentProvider('naver');
    }
  };

  // 구글 로그인 핸들러
  const handleGoogleLogin = async () => {
    console.log('[App] 구글 로그인 시작');
    
    // 구글 AuthManager로 전환
    switchToGoogleAuth();
    clearError();
    
    try {
      // 구글 AuthManager의 AuthActions 사용
      const googleAuthActions = new AuthActions(googleAuthManager);
      const success = await googleAuthActions.startOAuth('google');
      if (success) {
        console.log('[App] 구글 로그인 시작 성공');
      } else {
        console.log('[App] 구글 로그인 시작 실패');
      }
    } catch (error) {
      console.error('[App] 구글 로그인 예외:', error);
    }
  };

  // 카카오 로그인 핸들러
  const handleKakaoLogin = async () => {
    console.log('[App] 카카오 로그인 시작');
    
    // 카카오 AuthManager로 전환
    switchToKakaoAuth();
    clearError();
    
    try {
      // 카카오 AuthManager의 AuthActions 사용
      const kakaoAuthActions = new AuthActions(kakaoAuthManager);
      const success = await kakaoAuthActions.startOAuth('kakao');
      if (success) {
        console.log('[App] 카카오 로그인 시작 성공');
      } else {
        console.log('[App] 카카오 로그인 시작 실패');
      }
    } catch (error) {
      console.error('[App] 카카오 로그인 예외:', error);
    }
  };

  // 네이버 로그인 핸들러
  const handleNaverLogin = async () => {
    console.log('[App] 네이버 로그인 시작');
    
    // 네이버 AuthManager로 전환
    switchToNaverAuth();
    clearError();
    
    try {
      // 네이버 AuthManager의 AuthActions 사용
      const naverAuthActions = new AuthActions(naverAuthManager);
      const success = await naverAuthActions.startOAuth('naver');
      if (success) {
        console.log('[App] 네이버 로그인 시작 성공');
      } else {
        console.log('[App] 네이버 로그인 시작 실패');
      }
    } catch (error) {
      console.error('[App] 네이버 로그인 예외:', error);
    }
  };

  // 이메일 로그인 시작 핸들러
  const handleEmailLogin = () => {
    console.log('[App] 이메일 로그인 시작');
    
    // 이메일 AuthManager로 전환
    switchToEmailAuth();
    clearError();
    setCurrentScreen('email-input');
  };

  // 이메일 인증번호 요청 핸들러
  const handleRequestVerification = async (email: string): Promise<boolean> => {
    console.log('[App] 인증번호 요청:', email);
    
    // 이메일 AuthManager 사용
    const emailAuthActions = new AuthActions(emailAuthManager);
    const success = await emailAuthActions.requestEmailVerification(email);
    if (success) {
      setEmailForVerification(email);
      setCurrentScreen('verification-code');
    }
    return success;
  };

  // 인증번호 확인 및 로그인 핸들러
  const handleVerifyCode = async (email: string, verificationCode: string): Promise<boolean> => {
    console.log('[App] 인증번호 확인 및 로그인:', email);
    
    // 먼저 이메일 AuthManager로 전환
    console.log('[App] 이메일 AuthManager로 전환');
    setCurrentAuthManager(emailAuthManager);
    setCurrentProvider('email');
    
    // 상태 전환을 위해 잠시 대기
    await new Promise<void>(resolve => setTimeout(() => resolve(), 50));
    
    // 이메일 AuthManager 사용
    const emailAuthActions = new AuthActions(emailAuthManager);
    const success = await emailAuthActions.loginWithEmail(email, verificationCode);
    if (success) {
      // 메인 화면으로 이동
      setCurrentScreen('login');
      
      // 세션 상태 새로고침
      setTimeout(async () => {
        console.log('[App] 세션 상태 새로고침 시작');
        await refreshSession();
      }, 100);
    }
    return success;
  };

  // 인증번호 재발송 핸들러
  const handleResendCode = async (email: string): Promise<boolean> => {
    console.log('[App] 인증번호 재발송:', email);
    
    // 이메일 AuthManager 사용
    const emailAuthActions = new AuthActions(emailAuthManager);
    return await emailAuthActions.requestEmailVerification(email);
  };

  // 뒤로가기 핸들러
  const handleBack = () => {
    setCurrentScreen('login');
    clearError();
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    console.log('[App] 로그아웃 시작');
    
    try {
      const success = await authActions.signOut();
      if (success) {
        console.log('[App] 로그아웃 성공');
      } else {
        console.log('[App] 로그아웃 실패');
      }
    } catch (error) {
      console.error('[App] 로그아웃 예외:', error);
    }
  };

  // 로그인된 상태
  if (authState.isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🎉 로그인 성공!</Text>
          <Text style={styles.subtitle}>환영합니다!</Text>
        </View>
        
        <View style={styles.content}>
          {authState.userInfo && (
            <View style={styles.profileCard}>
              <Text style={styles.profileTitle}>사용자 정보</Text>
              <Text style={styles.profileText}>
                닉네임: {authState.userInfo.nickname || '미설정'}
              </Text>
              <Text style={styles.profileText}>
                이메일: {authState.userInfo.email || '미설정'}
              </Text>
              <Text style={styles.profileText}>
                제공자: {authState.userInfo.provider || '미설정'}
              </Text>
            </View>
          )}
          
          <LogoutButton 
            onPress={handleLogout}
            isLoading={authState.isLoading}
          />
          
          <Text style={styles.debugInfo}>
            🔍 디버그 정보:{'\n'}
            • 로그인 Provider: {currentProvider.toUpperCase()}{'\n'}
            • 로딩 상태: {authState.isLoading ? 'YES' : 'NO'}{'\n'}
            • OAuth 진행 중: {authState.isOAuthInProgress ? 'YES' : 'NO'}{'\n'}
            • 마지막 이벤트: {authState.lastEvent?.status || 'NONE'}
          </Text>
        </View>
      </View>
    );
  }

  // 이메일 입력 화면
  if (currentScreen === 'email-input') {
    return (
      <EmailInputScreen
        onRequestVerification={handleRequestVerification}
        onBack={handleBack}
        isLoading={authState.isLoading}
      />
    );
  }

  // 인증번호 입력 화면
  if (currentScreen === 'verification-code') {
    return (
      <VerificationCodeScreen
        email={emailForVerification}
        onVerifyCode={handleVerifyCode}
        onBack={handleBack}
        onResendCode={handleResendCode}
        isLoading={authState.isLoading}
      />
    );
  }

  // 로그인 전 상태
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔐 Login Demo</Text>
        <Text style={styles.subtitle}>Auth-Core + React Native</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          로그인이 필요합니다.{'\n'}
          아래 버튼을 눌러 로그인해보세요!
        </Text>
        
        <LoginButton 
          provider="google"
          onPress={handleGoogleLogin}
          isLoading={authState.isLoading || authState.isOAuthInProgress}
        />
        
        <LoginButton 
          provider="kakao"
          onPress={handleKakaoLogin}
          isLoading={authState.isLoading || authState.isOAuthInProgress}
        />
        
        <LoginButton 
          provider="naver"
          onPress={handleNaverLogin}
          isLoading={authState.isLoading || authState.isOAuthInProgress}
        />
        
        <LoginButton 
          provider="email"
          onPress={handleEmailLogin}
          isLoading={authState.isLoading}
        />
        
        {authState.error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>⚠️ 오류 발생</Text>
            <Text style={styles.errorMessage}>{authState.error}</Text>
          </View>
        )}
        
        <Text style={styles.mockInfo}>
          📝 현재 Mock Bridge 모드입니다.{'\n'}
          • 구글 로그인: 1.5초 후 가짜 로그인 완료{'\n'}
          • 카카오 로그인: 1.5초 후 가짜 로그인 완료{'\n'}
          • 네이버 로그인: 1.5초 후 가짜 로그인 완료{'\n'}
          • 이메일 로그인: 인증번호 123456 입력하면 로그인 성공
        </Text>
        
        <Text style={styles.debugInfo}>
          🔍 디버그 정보:{'\n'}
          • 현재 Provider: {currentProvider.toUpperCase()}{'\n'}
          • 로딩 상태: {authState.isLoading ? 'YES' : 'NO'}{'\n'}
          • OAuth 진행 중: {authState.isOAuthInProgress ? 'YES' : 'NO'}{'\n'}
          • 마지막 이벤트: {authState.lastEvent?.status || 'NONE'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 20,
    color: '#FF3B30',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
    lineHeight: 24,
  },
  mockInfo: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  profileCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  profileText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  errorCard: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 5,
  },
  debugInfo: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
});

export default App;
