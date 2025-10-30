/**
 * 로그인 버튼 컴포넌트
 * Google OAuth 시작을 위한 UI 컴포넌트
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Image
} from 'react-native';

// 소셜 로그인 아이콘 이미지 import
const socialIcons = {
  kakao: require('../assets/images/kakao_ic.png'),
  naver: require('../assets/images/naver_ic.png'),
  google: require('../assets/images/google_ic.png'),
};

interface LoginButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  provider: 'google' | 'kakao' | 'naver' | 'email' | 'start' | 'phone' | 'facebook' | 'apple' | 'close' | 'back';
  currentProvider?: string;
}

export function LoginButton({ 
  onPress, 
  isLoading = false, 
  disabled = false,
  provider,
  currentProvider
}: LoginButtonProps) {
  const getButtonStyle = () => {
    switch (provider) {
      case 'google':
        return styles.googleButton;
      case 'kakao':
        return styles.kakaoButton;
      case 'naver':
        return styles.naverButton;
      case 'email':
        return styles.emailButton;
      case 'start':
        return styles.startButton;
      case 'phone':
        return styles.phoneButton;
      case 'facebook':
        return styles.socialButton;
      case 'apple':
        return styles.socialButton;
      case 'close':
        return styles.closeButton;
      case 'back':
        return styles.backButton;
      default:
        return styles.googleButton;
    }
  };

  const getTextStyle = () => {
    switch (provider) {
      case 'google':
        return styles.googleText;
      case 'kakao':
        return styles.kakaoText;
      case 'naver':
        return styles.naverText;
      case 'email':
        return styles.emailText;
      case 'start':
        return styles.startText;
      case 'phone':
        return styles.phoneText;
      case 'facebook':
        return styles.socialText;
      case 'apple':
        return styles.socialText;
      case 'close':
        return styles.closeText;
      case 'back':
        return styles.backText;
      default:
        return styles.googleText;
    }
  };

  const getIcon = () => {
    switch (provider) {
      case 'google':
        return '🔍';
      case 'kakao':
        return '💛';
      case 'naver':
        return '🔵';
      case 'email':
        return '';
      case 'start':
        return '';
      case 'phone':
        return '';
      case 'facebook':
        return '📘';
      case 'apple':
        return '🍎';
      case 'close':
        return '×';
      case 'back':
        return '←';
      default:
        return '🔍';
    }
  };

  const getProviderName = () => {
    switch (provider) {
      case 'google':
        return 'Google';
      case 'kakao':
        return 'Kakao';
      case 'naver':
        return 'Naver';
      case 'email':
        return '이메일로 계속하기';
      case 'start':
        return '시작하기';
      case 'phone':
        return '전화번호로 계속하기';
      case 'facebook':
        return '';
      case 'apple':
        return '';
      case 'close':
        return '';
      case 'back':
        return `로그아웃 (${currentProvider?.toUpperCase() || 'UNKNOWN'})`;
      default:
        return 'Google';
    }
  };

  const getTextColor = () => {
    switch (provider) {
      case 'google':
        return '#fff';
      case 'kakao':
        return '#000';
      case 'email':
        return '#111827';
      case 'start':
        return '#fff';
      case 'phone':
        return '#fff';
      case 'facebook':
        return '#000';
      case 'apple':
        return '#000';
      case 'close':
        return '#666';
      case 'back':
        return '#fff';
      default:
        return '#fff';
    }
  };
  
  // 소셜 버튼 (아이콘만 표시)
  if (provider === 'facebook' || provider === 'apple' || provider === 'google' || provider === 'kakao' || provider === 'naver') {
    return (
      <TouchableOpacity
        style={[
          styles.socialButton,
          (disabled || isLoading) && styles.disabledButton
        ]}
        onPress={onPress}
        disabled={disabled || isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#666" />
        ) : (
          // 이미지가 있는 소셜 버튼은 이미지 사용, 없으면 이모지 사용
          socialIcons[provider as keyof typeof socialIcons] ? (
            <Image 
              source={socialIcons[provider as keyof typeof socialIcons]} 
              style={styles.socialIconImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.socialIcon}>
              {getIcon()}
            </Text>
          )
        )}
      </TouchableOpacity>
    );
  }

  // 닫기 버튼 (아이콘만 표시)
  if (provider === 'close') {
    return (
      <TouchableOpacity
        style={[
          styles.closeButton,
          (disabled || isLoading) && styles.disabledButton
        ]}
        onPress={onPress}
        disabled={disabled || isLoading}
        activeOpacity={0.8}
      >
        <Text style={styles.closeIcon}>
          {getIcon()}
        </Text>
      </TouchableOpacity>
    );
  }

  // 일반 버튼
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        (disabled || isLoading) && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        {isLoading ? (
          <ActivityIndicator 
            size="small" 
            color={getTextColor()} 
            style={styles.spinner}
          />
        ) : (
          getIcon() && (
            <Text style={styles.icon}>
              {getIcon()}
            </Text>
          )
        )}
        
        <Text style={[
          styles.buttonText,
          getTextStyle()
        ]}>
          {isLoading 
            ? `${getProviderName()} 로그인 중...`
            : getProviderName()
          }
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function LogoutButton({ 
  onPress, 
  isLoading = false, 
  disabled = false 
}: {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles.logoutButton,
        (disabled || isLoading) && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        {isLoading ? (
          <ActivityIndicator 
            size="small" 
            color="#fff" 
            style={styles.spinner}
          />
        ) : (
          <Text style={styles.icon}>🚪</Text>
        )}
        
        <Text style={styles.logoutText}>
          {isLoading ? '로그아웃 중...' : '로그아웃'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: '#4285f4',
  },
  kakaoButton: {
    backgroundColor: '#fee500',
  },
  naverButton: {
    backgroundColor: '#03c75a',
  },
  emailButton: {
    backgroundColor: '#e5e7eb',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  spinner: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  googleText: {
    color: '#fff',
  },
  kakaoText: {
    color: '#000',
  },
  naverText: {
    color: '#fff',
  },
  emailText: {
    color: '#111827',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // 새로운 버튼 스타일들
  startButton: {
    backgroundColor: '#1a1a1a',
  },
  phoneButton: {
    backgroundColor: '#111827',
  },
  socialButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    flex: 1,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  closeButton: {
    backgroundColor: 'transparent',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
  },
  backButton: {
    backgroundColor: '#3b82f6',
  },
  startText: {
    color: '#fff',
  },
  phoneText: {
    color: '#fff',
  },
  socialText: {
    color: '#000',
  },
  closeText: {
    color: '#666',
  },
  backText: {
    color: '#fff',
  },
  socialIcon: {
    fontSize: 20,
  },
  socialIconImage: {
    width: 32,
    height: 32,
  },
  closeIcon: {
    fontSize: 20,
    color: '#fff',
  },
});


