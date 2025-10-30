/**
 * Login Mobile App - React Native Demo
 * Auth-Core 연동 데모 앱
 *
 * @format
 */

import React from 'react';
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
  useAuthState, 
  AuthActions 
} from './src';
import { useAuthManagers } from './src/hooks/useAuthManagers';
import { useScreenNavigation, ScreenType } from './src/hooks/useScreenNavigation';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { LoginSelectorScreen } from './src/screens/LoginSelectorScreen';
import { OAuthContinueScreen } from './src/screens/OAuthContinueScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { EmailInputScreen } from './src/screens/EmailInputScreen';
import { VerificationCodeScreen } from './src/screens/VerificationCodeScreen';
import { LoginCompleteScreen } from './src/screens/LoginCompleteScreen';
import { ServiceMainScreen } from './src/screens/ServiceMainScreen';


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
  const { authManagers, initError, isLoading } = useAuthManagers();

  // 로딩 상태
  if (isLoading) {
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
        emailAuthManager={authManagers.emailAuthManager!} 
        googleAuthManager={authManagers.googleAuthManager!}
        kakaoAuthManager={authManagers.kakaoAuthManager!}
        naverAuthManager={authManagers.naverAuthManager!}
      />
    </View>
  );
}


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
  // 화면 네비게이션 훅 사용
  const {
    currentScreen,
    currentAuthManager,
    currentProvider,
    emailForVerification,
    setCurrentScreen,
    setEmailForVerification,
    handleStartApp,
    handleBackToSplash,
    handleBack,
    handleEmailLogin,
    handleOAuthContinue,
    handleLoginSuccess,
    handleConnectNow,
    handleLater,
    handleGoToDashboard,
    handleGoToLogin,
    handleBackToLoginComplete,
    switchToGoogleAuth,
    switchToKakaoAuth,
    switchToNaverAuth,
  } = useScreenNavigation({
    emailAuthManager,
    googleAuthManager,
    kakaoAuthManager,
    naverAuthManager,
  });
  
  const { authState, clearError, refreshSession } = useAuthState(currentAuthManager);
  
  // AuthActions 인스턴스 생성 (현재 AuthManager 기준)
  const authActions = new AuthActions(currentAuthManager);

  console.log('[App] 현재 인증 상태:', authState);
  console.log('[App] 현재 화면:', currentScreen);

  // 구글 로그인 핸들러 (계속하기 화면으로 이동)
  const handleGoogleLogin = () => {
    handleOAuthContinue('google');
  };

  // OAuth 계속하기에서 실제 로그인 시도
  const handleOAuthLogin = async (provider: 'google' | 'kakao' | 'naver') => {
    console.log(`[App] ${provider} 로그인 시작`);
    
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
        console.log(`[App] ${provider} 로그인 시작 성공`);
      } else {
        console.log(`[App] ${provider} 로그인 시작 실패`);
      }
    } catch (error) {
      console.error(`[App] ${provider} 로그인 예외:`, error);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    console.log('[App] 로그아웃 시작');
    
    try {
      const success = await authActions.signOut();
      if (success) {
        console.log('[App] 로그아웃 성공');
        // 웹 앱과 동일하게 스플래시 화면으로 리다이렉트
        handleBackToSplash();
      } else {
        console.log('[App] 로그아웃 실패');
        // 실패해도 스플래시 화면으로 이동 (로컬 세션 정리)
        handleBackToSplash();
      }
    } catch (error) {
      console.error('[App] 로그아웃 예외:', error);
      // 예외 발생해도 스플래시 화면으로 이동 (로컬 세션 정리)
      handleBackToSplash();
    }
  };

  // 스플래시 화면
  if (currentScreen === 'splash') {
    return <SplashScreen onStartApp={handleStartApp} />;
  }

  // 로그인 완료 화면
  if (currentScreen === 'login-complete') {
    return (
      <LoginCompleteScreen
        onConnectNow={handleConnectNow}
        onLater={handleLater}
      />
    );
  }

  // 서비스 메인 화면
  if (currentScreen === 'service-main') {
    return (
      <ServiceMainScreen
        isAuthenticated={authState.isLoggedIn}
        onGoToDashboard={handleGoToDashboard}
        onLogout={handleLogout}
        onGoToLogin={handleGoToLogin}
      />
    );
  }

  // 대시보드 화면
  if (currentScreen === 'dashboard') {
    return (
      <DashboardScreen 
        authState={authState}
        currentProvider={currentProvider}
        onLogout={handleLogout}
        onBackToLoginComplete={handleBackToLoginComplete}
      />
    );
  }

  // 로그인된 상태 - 기본적으로 로그인 선택 화면 표시 (로그아웃 후 돌아올 곳)
  if (authState.isLoggedIn && !['login-complete', 'service-main', 'dashboard'].includes(currentScreen)) {
    return (
      <DashboardScreen 
        authState={authState}
        currentProvider={currentProvider}
        onLogout={handleLogout}
        onBackToLoginComplete={handleBackToLoginComplete}
      />
    );
  }

  // 이메일 입력 화면 (웹과 동일한 스타일)
  if (currentScreen === 'email-input') {
    return (
      <EmailInputScreen
        authState={authState}
        emailForVerification={emailForVerification}
        onBack={handleBack}
        onEmailChange={setEmailForVerification}
        onRequestVerification={async () => {
          // 이메일 인증번호 요청
          const emailAuthActions = new AuthActions(emailAuthManager);
          const success = await emailAuthActions.requestEmailVerification(emailForVerification);
          if (success) {
            setCurrentScreen('verification-code');
          }
        }}
      />
    );
  }

  // 인증번호 입력 화면 (웹과 동일한 스타일)
  if (currentScreen === 'verification-code') {
    return (
      <VerificationCodeScreen
        emailForVerification={emailForVerification}
        onBack={handleBack}
        setCurrentAuthManager={(_manager: AuthManager) => {
          // AuthManager 전환 로직은 useScreenNavigation에서 처리
        }}
        setCurrentProvider={(_provider: 'email' | 'google' | 'kakao' | 'naver') => {
          // Provider 전환 로직은 useScreenNavigation에서 처리
        }}
        setCurrentScreen={(screen: string) => setCurrentScreen(screen as ScreenType)}
        emailAuthManager={emailAuthManager}
        refreshSession={refreshSession}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Google 계속하기 화면
  if (currentScreen === 'google-continue') {
    return (
      <OAuthContinueScreen
        provider="google"
        authState={authState}
        onBack={handleBack}
        onOAuthLogin={handleOAuthLogin}
      />
    );
  }

  // Kakao 계속하기 화면
  if (currentScreen === 'kakao-continue') {
    return (
      <OAuthContinueScreen
        provider="kakao"
        authState={authState}
        onBack={handleBack}
        onOAuthLogin={handleOAuthLogin}
      />
    );
  }

  // Naver 계속하기 화면
  if (currentScreen === 'naver-continue') {
    return (
      <OAuthContinueScreen
        provider="naver"
        authState={authState}
        onBack={handleBack}
        onOAuthLogin={handleOAuthLogin}
      />
    );
  }

  // 로그인 방식 선택 화면 (웹과 유사한 스타일)
  return (
    <LoginSelectorScreen
      authState={authState}
      onBackToSplash={handleBackToSplash}
      onEmailLogin={handleEmailLogin}
      onOAuthContinue={handleOAuthContinue}
      onGoogleLogin={handleGoogleLogin}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  // OAuth 헤더 스타일
  oauthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  headerSpacer: {
    flex: 1,
  },
  // OAuth 버튼 스타일
  oauthButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emailOAuthButton: {
    backgroundColor: '#1a1a1a',
  },
  oauthButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  errorMessage: {
    backgroundColor: '#fef2f2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
});

export default App;
