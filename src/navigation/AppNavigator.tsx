/**
 * React Navigation App Navigator
 * 기존 화면 플로우를 유지하면서 React Navigation으로 전환
 */

import React, { useRef } from 'react';
import { NavigationContainer, NavigationContainerRef, NavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthManager } from '@growgrammers/auth-core';
import type { RootStackParamList } from './types';

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
    authState: any;
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

  return (
    <NavigationContainer<RootStackParamList>
      ref={(ref) => {
        navigationRef.current = ref;
        if (setNavigationRef) {
          setNavigationRef(ref);
        }
      }}
      onStateChange={onNavigationStateChange}
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
              onGoogleLogin={() => navigationHandlers.handleOAuthContinue('google')}
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
              onRequestVerification={async () => {
                const { AuthActions } = await import('../utils/AuthEventHandler');
                const emailAuthActions = new AuthActions(emailAuthManager);
                const success = await emailAuthActions.requestEmailVerification(
                  navigationState.emailForVerification
                );
                if (success) {
                  props.navigation.navigate('VerificationCode');
                }
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="VerificationCode">
          {(props) => (
            <VerificationCodeScreen
              {...props}
              emailForVerification={navigationState.emailForVerification}
              onBack={navigationHandlers.handleBack}
              setCurrentAuthManager={(_manager: AuthManager) => {
                // AuthManager 전환 로직은 useScreenNavigation에서 처리
              }}
              setCurrentProvider={(_provider: 'email' | 'google' | 'kakao' | 'naver') => {
                // Provider 전환 로직은 useScreenNavigation에서 처리
              }}
              setCurrentScreen={(_screen: string) => {
                // React Navigation으로 자동 처리
              }}
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

