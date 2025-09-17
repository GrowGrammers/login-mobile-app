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
  provider: 'google' | 'kakao';
}

export function LoginButton({ 
  onPress, 
  isLoading = false, 
  disabled = false,
  provider 
}: LoginButtonProps) {
  const isGoogleLogin = provider === 'google';
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isGoogleLogin ? styles.googleButton : styles.kakaoButton,
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
            color={isGoogleLogin ? '#fff' : '#000'} 
            style={styles.spinner}
          />
        ) : (
          <Text style={styles.icon}>
            {isGoogleLogin ? '🔍' : '💬'}
          </Text>
        )}
        
        <Text style={[
          styles.buttonText,
          isGoogleLogin ? styles.googleText : styles.kakaoText
        ]}>
          {isLoading 
            ? `${provider === 'google' ? 'Google' : 'Kakao'} 로그인 중...`
            : `${provider === 'google' ? 'Google' : 'Kakao'}로 로그인`
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
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


