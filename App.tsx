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
import { initializeMockAuth, useAuthState, AuthActions } from './src';
import { LoginButton, LogoutButton } from './src/components/LoginButton';

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
  const [authManager, setAuthManager] = useState<AuthManager | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  // AuthManager 초기화
  useEffect(() => {
    console.log('[App] AuthManager 초기화 시작...');
    //팩토리 함수 호출하여 AuthManager 초기화
    initializeMockAuth({
      provider: 'google',
      apiBaseUrl: 'https://api.example.com',
      googleClientId: 'mock-client-id-for-development',
      useMockBridge: true, // 개발용 Mock Bridge 사용
      enableDebugLogs: true
    })
    .then((manager) => {
      console.log('[App] AuthManager 초기화 성공!');
      // AuthManager 인스턴스 받아서 react state에 저장
      setAuthManager(manager);
    })
    .catch((error) => {
      console.error('[App] AuthManager 초기화 실패:', error);
      setInitError(error.message || '초기화 실패');
    });
  }, []);

  // 로딩 상태
  if (!authManager && !initError) {
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
      <LoginMobileApp authManager={authManager!} />
    </View>
  );
}

// 메인 로그인 앱 컴포넌트
function LoginMobileApp({ authManager }: { authManager: AuthManager }) {
  const { authState, clearError } = useAuthState(authManager);
  
  // AuthActions 인스턴스 생성
  const authActions = new AuthActions(authManager);

  console.log('[App] 현재 인증 상태:', authState);

  // 로그인 핸들러
  const handleGoogleLogin = async () => {
    console.log('[App] 구글 로그인 시작');
    clearError(); // 이전 에러 정리
    
    try {
      const success = await authActions.startOAuth('google');
      if (success) {
        console.log('[App] 구글 로그인 시작 성공');
      } else {
        console.log('[App] 구글 로그인 시작 실패');
      }
    } catch (error) {
      console.error('[App] 구글 로그인 예외:', error);
    }
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
            • 로딩 상태: {authState.isLoading ? 'YES' : 'NO'}{'\n'}
            • OAuth 진행 중: {authState.isOAuthInProgress ? 'YES' : 'NO'}{'\n'}
            • 마지막 이벤트: {authState.lastEvent?.status || 'NONE'}
          </Text>
        </View>
      </View>
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
        
        {authState.error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>⚠️ 오류 발생</Text>
            <Text style={styles.errorMessage}>{authState.error}</Text>
          </View>
        )}
        
        <Text style={styles.mockInfo}>
          📝 현재 Mock Bridge 모드입니다.{'\n'}
          실제 구글 로그인이 아닌 시뮬레이션입니다.{'\n'}
          버튼을 누르면 1.5초 후 가짜 로그인이 완료됩니다.
        </Text>
        
        <Text style={styles.debugInfo}>
          🔍 디버그 정보:{'\n'}
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
