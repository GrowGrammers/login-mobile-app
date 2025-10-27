/**
 * LoginSelectorScreen - 로그인 방식 선택 화면
 * 전화번호, 이메일, 소셜 로그인 옵션을 제공
 */

import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { LoginButton } from '../components/LoginButton';

interface LoginSelectorScreenProps {
  authState: {
    isLoading: boolean;
    isOAuthInProgress?: boolean;
  };
  onBackToSplash: () => void;
  onEmailLogin: () => void;
  onOAuthContinue: (provider: 'google' | 'kakao' | 'naver') => void;
  onGoogleLogin: () => void;
}

export function LoginSelectorScreen({
  authState,
  onBackToSplash,
  onEmailLogin,
  onOAuthContinue,
  onGoogleLogin
}: LoginSelectorScreenProps) {
  return (
    <View style={styles.loginSelectorContainer}>
      {/* X 버튼 - 스플래시 화면으로 이동 */}
      <View style={styles.closeButtonContainer}>
        <LoginButton 
          provider="close"
          onPress={onBackToSplash}
          isLoading={false}
        />
      </View>
      
      <View style={styles.loginSelectorContent}>
        <View style={styles.loginSelectorHeader}>
          <Text style={styles.loginSelectorTitle}>시작하기</Text>
          <Text style={styles.loginSelectorSubtitle}>
            업체가 요구하는 문구를 작성하는 영역입니다. 최대 2줄까지 노출 최대 2줄까지 노출 최대 2줄까지 노출 최대 2줄까지 노출 최대 2줄까지 노출 최대 2줄까지 노출 최대 2줄까지 노출 최대 2줄까지 노출
          </Text>
        </View>
        
        <View style={styles.loginSelectorButtons}>
          {/* 바텀 시트 핸들 */}
          <View style={styles.bottomSheetHandle} />
          
          <LoginButton 
            provider="phone"
            onPress={() => Alert.alert('알림', '전화번호 인증 로그인은 추후 구현 예정입니다.')}
            isLoading={false}
          />
          
          <LoginButton 
            provider="email"
            onPress={onEmailLogin}
            isLoading={authState.isLoading}
          />
          
          <View style={styles.socialButtonsContainer}>
            <LoginButton 
              provider="kakao"
              onPress={() => onOAuthContinue('kakao')}
              isLoading={authState.isLoading || authState.isOAuthInProgress}
            />
            
            <LoginButton 
              provider="naver"
              onPress={() => onOAuthContinue('naver')}
              isLoading={authState.isLoading || authState.isOAuthInProgress}
            />
            
            <LoginButton 
              provider="google"
              onPress={onGoogleLogin}
              isLoading={authState.isLoading || authState.isOAuthInProgress}
            />
          </View>
          
          <TouchableOpacity 
            onPress={() => Alert.alert('알림', '계정 찾기 기능은 추후 구현 예정입니다.')}
          >
            <Text style={styles.forgotAccountText}>
              계정이 기억나지 않으세요?
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => Alert.alert('알림', '이용약관에 연결될 예정입니다.')}
          >
            <Text style={styles.termsText}>
              계속하면 [서비스명]의 이용 약관에 동의하는 것 입니다.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginSelectorContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginSelectorContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  loginSelectorHeader: {
    paddingTop: 200,
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  loginSelectorTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  loginSelectorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    maxHeight: 44, // 2줄 제한
  },
  loginSelectorButtons: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 32,
    paddingTop: 12,
    gap: 16,
  },
  bottomSheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
    width: '100%',
  },
  forgotAccountText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
});
