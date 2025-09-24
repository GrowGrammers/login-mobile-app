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
  View
} from 'react-native';

interface LoginButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  provider: 'google' | 'kakao' | 'naver' | 'email';
}

export function LoginButton({ 
  onPress, 
  isLoading = false, 
  disabled = false,
  provider 
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
      default:
        return styles.googleText;
    }
  };

  const getIcon = () => {
    switch (provider) {
      case 'google':
        return '🔍';
      case 'kakao':
        return '💬';
      case 'naver':
        return '🟢';
      case 'email':
        return '📧';
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
        return '이메일';
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
        return '#fff';
      default:
        return '#fff';
    }
  };
  
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
          <Text style={styles.icon}>
            {getIcon()}
          </Text>
        )}
        
        <Text style={[
          styles.buttonText,
          getTextStyle()
        ]}>
          {isLoading 
            ? `${getProviderName()} 로그인 중...`
            : `${getProviderName()}로 로그인`
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
    backgroundColor: '#6c5ce7',
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
    color: '#fff',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


