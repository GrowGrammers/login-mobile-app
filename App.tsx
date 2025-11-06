/**
 * Login Mobile App - React Native Demo
 * Auth-Core 연동 데모 앱
 *
 * @format
 */

import React, { useCallback } from 'react';
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
import { useScreenNavigation } from './src/hooks/useScreenNavigation';
import { useAuthHandlers } from './src/hooks/useAuthHandlers';
import { AppNavigator } from './src/navigation/AppNavigator';



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
    setNavigationRef,
    onNavigationStateChange,
  } = useScreenNavigation({
    emailAuthManager,
    googleAuthManager,
    kakaoAuthManager,
    naverAuthManager,
  });
  
  const { authState, clearError, refreshSession } = useAuthState(currentAuthManager);

  console.log('[App] 현재 인증 상태:', authState);
  console.log('[App] 현재 화면:', currentScreen);

  // AuthActions 팩토리 함수: 항상 최신 currentAuthManager로 인스턴스 생성
  const getAuthActions = useCallback(() => {
    return new AuthActions(currentAuthManager);
  }, [currentAuthManager]);

  // 인증 핸들러 훅 사용
  const { handleOAuthLogin, handleLogout } = useAuthHandlers({
    emailAuthManager,
    googleAuthManager,
    kakaoAuthManager,
    naverAuthManager,
    switchToGoogleAuth,
    switchToKakaoAuth,
    switchToNaverAuth,
    clearError,
    handleBackToSplash,
    getAuthActions,
  });

  // React Navigation으로 전환 - 조건부 렌더링 제거
  return (
    <AppNavigator
      emailAuthManager={emailAuthManager}
      googleAuthManager={googleAuthManager}
      kakaoAuthManager={kakaoAuthManager}
      naverAuthManager={naverAuthManager}
      navigationHandlers={{
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
        handleOAuthLogin,
        handleLogout,
      }}
      navigationState={{
        currentAuthManager,
        currentProvider,
        emailForVerification,
        setEmailForVerification,
        authState,
        clearError,
        refreshSession,
      }}
      initialRouteName="Splash"
      setNavigationRef={setNavigationRef}
      onNavigationStateChange={onNavigationStateChange}
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
