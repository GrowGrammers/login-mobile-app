/**
 * OAuthContinueScreen - OAuth 계속하기 화면 (Google, Kakao, Naver 통합)
 * 각 OAuth 제공자의 계속하기 화면을 통합하여 관리
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthState } from '../utils/AuthEventHandler';
import { Header } from '../components/Header';

interface OAuthContinueScreenProps {
  provider: 'google' | 'kakao' | 'naver';
  authState: AuthState;
  onBack: () => void;
  onOAuthLogin: (provider: 'google' | 'kakao' | 'naver') => void;
}

export function OAuthContinueScreen({
  provider,
  authState,
  onBack,
  onOAuthLogin
}: OAuthContinueScreenProps) {
  const providerConfig = {
    google: {
      title: 'Google로 계속하기',
      subtitle: 'Google 계정으로 빠르게 로그인하거나 가입하세요',
      buttonText: 'Google로 계속하기',
      loadingText: 'Google 인증 중...',
      buttonStyle: styles.googleOAuthButton,
      textStyle: styles.oauthButtonText,
    },
    kakao: {
      title: 'Kakao로 계속하기',
      subtitle: 'Kakao 계정으로 빠르게 로그인하거나 가입하세요',
      buttonText: 'Kakao로 계속하기',
      loadingText: 'Kakao 인증 중...',
      buttonStyle: styles.kakaoOAuthButton,
      textStyle: styles.kakaoOAuthButtonText,
    },
    naver: {
      title: 'Naver로 계속하기',
      subtitle: 'Naver 계정으로 빠르게 로그인하거나 가입하세요',
      buttonText: 'Naver로 계속하기',
      loadingText: 'Naver 인증 중...',
      buttonStyle: styles.naverOAuthButton,
      textStyle: styles.oauthButtonText,
    },
  };

  const config = providerConfig[provider];

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <Header onBack={onBack} showBackButton={true} />
      
      {/* 콘텐츠 헤더 */}
      <View style={styles.continueHeader}>
        <Text style={styles.continueTitle}>{config.title}</Text>
        <Text style={styles.continueSubtitle}>{config.subtitle}</Text>
      </View>
      
      <View style={styles.continueContent}>
        <TouchableOpacity
          style={[
            styles.oauthButton,
            config.buttonStyle,
            (authState.isLoading || authState.isOAuthInProgress) && styles.disabledButton
          ]}
          onPress={() => onOAuthLogin(provider)}
          disabled={authState.isLoading || authState.isOAuthInProgress}
          activeOpacity={0.8}
        >
          <Text style={config.textStyle}>
            {authState.isLoading || authState.isOAuthInProgress 
              ? config.loadingText
              : config.buttonText
            }
          </Text>
        </TouchableOpacity>
        
        {authState.error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>⚠️ 오류 발생</Text>
            <Text style={styles.errorMessage}>{authState.error}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  // OAuth 계속하기 화면 스타일
  continueHeader: {
    paddingTop: 64,
    paddingHorizontal: 32,
    paddingBottom: 16,
    alignItems: 'flex-start',
  },
  continueTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'left',
  },
  continueSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'left',
  },
  continueContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 32,
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
  googleOAuthButton: {
    backgroundColor: '#4285f4',
  },
  kakaoOAuthButton: {
    backgroundColor: '#fee500',
  },
  naverOAuthButton: {
    backgroundColor: '#03c75a',
  },
  oauthButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  kakaoOAuthButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  // 에러 카드 스타일
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
  errorMessage: {
    fontSize: 14,
    color: '#FF3B30',
  },
});
