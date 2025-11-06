/**
 * React Navigation App Navigator
 * 기존 화면 플로우를 유지하면서 React Navigation으로 전환
 */

import React, { useRef, useCallback, useEffect } from 'react';
import { BackHandler, Alert, Platform } from 'react-native';
import { NavigationContainer, NavigationContainerRef, NavigationState, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthManager } from '@growgrammers/auth-core';
import type { RootStackParamList } from './types';
import type { AuthState } from '../utils/AuthEventHandler';

// Screen Components
import { SplashScreen } from '../screens/SplashScreen';
import { LoginSelectorScreen } from '../screens/LoginSelectorScreen';
import { EmailInputScreen } from '../screens/EmailInputScreen';
import { VerificationCodeScreen } from '../screens/VerificationCodeScreen';
import { OAuthContinueScreen } from '../screens/OAuthContinueScreen';
import { LoginCompleteScreen } from '../screens/LoginCompleteScreen';
import { ServiceMainScreen } from '../screens/ServiceMainScreen';
import { DashboardScreen } from '../screens/DashboardScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export interface AppNavigatorProps {
  // AuthManagers
  emailAuthManager: AuthManager;
  googleAuthManager: AuthManager;
  kakaoAuthManager: AuthManager;
  naverAuthManager: AuthManager;
  
  // Navigation handlers (기존 로직 유지)
  navigationHandlers: {
    handleStartApp: () => void;
    handleBackToSplash: () => void;
    handleBack: () => void;
    handleEmailLogin: () => void;
    handleOAuthContinue: (provider: 'google' | 'kakao' | 'naver') => void;
    handleLoginSuccess: () => void;
    handleConnectNow: () => void;
    handleLater: () => void;
    handleGoToDashboard: () => void;
    handleGoToLogin: () => void;
    handleBackToLoginComplete: () => void;
    handleOAuthLogin: (provider: 'google' | 'kakao' | 'naver') => Promise<void>;
    handleLogout: () => Promise<void>;
  };
  
  // Navigation state
  navigationState: {
    currentAuthManager: AuthManager;
    currentProvider: 'email' | 'google' | 'kakao' | 'naver';
    emailForVerification: string;
    setEmailForVerification: (email: string) => void;
    authState: AuthState;
    clearError: () => void;
    refreshSession: () => Promise<void>;
  };
  
  // Initial route
  initialRouteName?: keyof RootStackParamList;
  // Navigation ref setter (useScreenNavigation과 통합)
  setNavigationRef?: (navigation: NavigationContainerRef<RootStackParamList> | null) => void;
  // Navigation state change handler (공식 onStateChange prop 사용)
  onNavigationStateChange?: (state: NavigationState<RootStackParamList> | undefined) => void;
}

export function AppNavigator({
  emailAuthManager,
  googleAuthManager: _googleAuthManager,
  kakaoAuthManager: _kakaoAuthManager,
  naverAuthManager: _naverAuthManager,
  navigationHandlers,
  navigationState,
  initialRouteName = 'Splash',
  setNavigationRef,
  onNavigationStateChange,
}: AppNavigatorProps) {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList> | null>(null);

  // onStateChange 핸들러 래퍼 (타입 호환성 처리)
  // NavigationContainer의 onStateChange는 일반적인 NavigationState를 기대하므로
  // 타입 단언을 통해 RootStackParamList로 변환
  const handleStateChange = useCallback((
    state: NavigationState<ParamListBase> | undefined
  ) => {
    if (onNavigationStateChange) {
      // NavigationContainer가 RootStackParamList로 타입화되어 있으므로
      // 실제로는 RootStackParamList 타입이지만 타입 시스템이 이를 인식하지 못함
      onNavigationStateChange(state as NavigationState<RootStackParamList> | undefined);
    }
  }, [onNavigationStateChange]);

  // inline handler 메모이제이션 (불필요한 리렌더 방지)
  const handleGoogleLogin = useCallback(() => {
    navigationHandlers.handleOAuthContinue('google');
  }, [navigationHandlers]);

  // EmailInputScreen의 onRequestVerification 핸들러 메모이제이션
  const handleRequestVerification = useCallback(async (navigation: any) => {
    const { AuthActions } = await import('../utils/AuthEventHandler');
    const emailAuthActions = new AuthActions(emailAuthManager);
    const success = await emailAuthActions.requestEmailVerification(
      navigationState.emailForVerification
    );
    if (success) {
      navigation.navigate('VerificationCode');
    }
  }, [emailAuthManager, navigationState.emailForVerification]);

  // VerificationCodeScreen의 빈 핸들러들 메모이제이션 (불필요한 리렌더 방지)
  const emptySetCurrentAuthManager = useCallback((_manager: AuthManager) => {
    // AuthManager 전환 로직은 useScreenNavigation에서 처리
  }, []);
  
  const emptySetCurrentProvider = useCallback((_provider: 'email' | 'google' | 'kakao' | 'naver') => {
    // Provider 전환 로직은 useScreenNavigation에서 처리
  }, []);
  
  const emptySetCurrentScreen = useCallback((_screen: string) => {
    // React Navigation으로 자동 처리
  }, []);

  // Android 하드웨어 뒤로가기 처리
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!navigationRef.current?.isReady()) {
        return false; // 기본 동작 허용
      }

      // 네비게이션 스택에 이전 화면이 있으면 기본 뒤로가기 동작
      if (navigationRef.current.canGoBack()) {
        navigationHandlers.handleBack();
        return true; // 기본 동작 차단
      }

      // 루트 스크린에서 뒤로가기 시 Alert 확인 후 Splash로 이동
      Alert.alert(
        '앱 종료',
        '앱을 종료하시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: '종료',
            style: 'destructive',
            onPress: () => {
              navigationHandlers.handleBackToSplash();
            },
          },
        ],
        { cancelable: true }
      );

      return true; // 기본 동작 차단
    });

    return () => backHandler.remove();
  }, [navigationHandlers]);

  return (
    <NavigationContainer<RootStackParamList>
      ref={(ref) => {
        navigationRef.current = ref;
        if (setNavigationRef) {
          setNavigationRef(ref);
        }
      }}
      onStateChange={handleStateChange}
    >
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="Splash">
          {(props) => (
            <SplashScreen
              {...props}
              onStartApp={navigationHandlers.handleStartApp}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Login">
          {(props) => (
            <LoginSelectorScreen
              {...props}
              authState={navigationState.authState}
              onBackToSplash={navigationHandlers.handleBackToSplash}
              onEmailLogin={navigationHandlers.handleEmailLogin}
              onOAuthContinue={navigationHandlers.handleOAuthContinue}
              onGoogleLogin={handleGoogleLogin}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="EmailInput">
          {(props) => (
            <EmailInputScreen
              {...props}
              authState={navigationState.authState}
              emailForVerification={navigationState.emailForVerification}
              onBack={navigationHandlers.handleBack}
              onEmailChange={navigationState.setEmailForVerification}
              onRequestVerification={() => handleRequestVerification(props.navigation)}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="VerificationCode">
          {(props) => (
            <VerificationCodeScreen
              {...props}
              emailForVerification={navigationState.emailForVerification}
              onBack={navigationHandlers.handleBack}
              setCurrentAuthManager={emptySetCurrentAuthManager}
              setCurrentProvider={emptySetCurrentProvider}
              setCurrentScreen={emptySetCurrentScreen}
              emailAuthManager={emailAuthManager}
              refreshSession={navigationState.refreshSession}
              onLoginSuccess={navigationHandlers.handleLoginSuccess}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="GoogleContinue">
          {(props) => (
            <OAuthContinueScreen
              {...props}
              provider="google"
              authState={navigationState.authState}
              onBack={navigationHandlers.handleBack}
              onOAuthLogin={navigationHandlers.handleOAuthLogin}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="KakaoContinue">
          {(props) => (
            <OAuthContinueScreen
              {...props}
              provider="kakao"
              authState={navigationState.authState}
              onBack={navigationHandlers.handleBack}
              onOAuthLogin={navigationHandlers.handleOAuthLogin}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="NaverContinue">
          {(props) => (
            <OAuthContinueScreen
              {...props}
              provider="naver"
              authState={navigationState.authState}
              onBack={navigationHandlers.handleBack}
              onOAuthLogin={navigationHandlers.handleOAuthLogin}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="LoginComplete">
          {(props) => (
            <LoginCompleteScreen
              {...props}
              onConnectNow={navigationHandlers.handleConnectNow}
              onLater={navigationHandlers.handleLater}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="ServiceMain">
          {(props) => (
            <ServiceMainScreen
              {...props}
              isAuthenticated={navigationState.authState.isLoggedIn}
              onGoToDashboard={navigationHandlers.handleGoToDashboard}
              onLogout={navigationHandlers.handleLogout}
              onGoToLogin={navigationHandlers.handleGoToLogin}
              onBackToLoginComplete={navigationHandlers.handleBackToLoginComplete}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Dashboard">
          {(props) => (
            <DashboardScreen
              {...props}
              authState={navigationState.authState}
              currentProvider={navigationState.currentProvider}
              onLogout={navigationHandlers.handleLogout}
              onBackToLoginComplete={navigationHandlers.handleBackToLoginComplete}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

