/**
 * LoginSelectorScreen - 로그인 방식 선택 화면
 * 전화번호, 이메일, 소셜 로그인 옵션을 제공
 */

import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Linking } from 'react-native';
import { LoginButton } from '../components/LoginButton';
//import { Header } from '../components/Header';

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
  // 이용약관 링크 처리
  const handleTermsPress = async () => {
    const url = 'https://amazing-jelly-42b.notion.site/27fbb18df73c80aabc58dbf959588677?source=copy_link';
    
    try {
      // canOpenURL이 false를 반환할 수 있지만, 실제로는 열리므로 바로 시도
      await Linking.openURL(url);
    } catch (error) {
      console.error('이용약관 링크 열기 오류:', error);
      Alert.alert('오류', '링크를 여는 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.loginSelectorContainer}>
      {/* 헤더 (뒤로가기 버튼 없음) */}
      {/* <Header showBackButton={false} />
       */}
      {/* 상단 헤더 영역 (인증 상태 배지 영역) */}
      {/* <View style={styles.headerArea}> */}
        {/* 인증 상태 표시 영역 (추후 필요시 구현) */}
      {/* </View> */}
      
      {/* 바텀시트를 하단에 고정 */}
      <View style={styles.bottomSheetContainer}>
        <View style={styles.bottomSheet}>
          {/* X 버튼 - 스플래시 화면으로 이동 */}
          <View style={styles.closeButtonContainer}>
            <LoginButton 
              provider="close"
              onPress={onBackToSplash}
              isLoading={false}
            />
          </View>
          
          {/* 제목과 설명 텍스트 */}
          <View style={styles.titleSection}>
            <Text style={styles.loginSelectorTitle}>시작하기</Text>
            <Text style={styles.loginSelectorSubtitle}>
              업체가 요구하는 문구를 작성하는 영역입니다. 최대 2줄까지 노출 최대 2줄까지 노출 최대 2줄까지 노출 최대 2줄까지 노출 최대 2줄까지 노출 최대 2줄까지 노출 최대 2줄까지 노출 최대 2줄까지 노출
            </Text>
          </View>
          
          {/* 버튼들 */}
          <View style={styles.buttonsSection}>
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
              onPress={handleTermsPress}
            >
              <Text style={styles.termsText}>
                계속하면 [서비스명]의 <Text style={styles.termsLink}>이용 약관</Text>에 동의하는 것 입니다.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginSelectorContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerArea: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 32,
    paddingHorizontal: 32,
    paddingBottom: 16,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 30,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6b7280',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    marginTop: 24,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  loginSelectorTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'left',
  },
  loginSelectorSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'left',
    lineHeight: 24,
    maxHeight: 48, // 2줄 제한
  },
  buttonsSection: {
    gap: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    width: '100%',
  },
  forgotAccountText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  termsLink: {
    color: '#6b7280',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
