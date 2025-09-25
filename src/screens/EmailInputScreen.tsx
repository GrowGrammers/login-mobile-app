/**
 * EmailInputScreen - 이메일 입력 화면
 * 이메일 주소를 입력하고 인증번호를 요청하는 화면
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthState } from '../utils/AuthEventHandler';

interface EmailInputScreenProps {
  authState: AuthState;
  emailForVerification: string;
  onBack: () => void;
  onEmailChange: (email: string) => void;
  onRequestVerification: () => void;
}

export function EmailInputScreen({
  authState,
  emailForVerification,
  onBack,
  onEmailChange,
  onRequestVerification
}: EmailInputScreenProps) {
  return (
    <View style={styles.container}>
      {/* 헤더 - 뒤로가기 버튼만 */}
      <View style={styles.oauthHeader}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.headerBackButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>
      
      <View style={styles.continueHeader}>
        <Text style={styles.continueTitle}>이메일로 계속하기</Text>
        <Text style={styles.continueSubtitle}>이메일로 로그인하거나 가입하세요</Text>
      </View>
      
      <View style={styles.continueContent}>
        <TextInput
          style={styles.emailInput}
          placeholder="이메일 주소"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={emailForVerification}
          onChangeText={onEmailChange}
          editable={!authState.isLoading}
        />
        
        <TouchableOpacity
          style={[
            styles.oauthButton,
            styles.emailOAuthButton,
            authState.isLoading && styles.disabledButton
          ]}
          onPress={onRequestVerification}
          disabled={authState.isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.oauthButtonText}>
            {authState.isLoading ? '인증번호 발송 중...' : '인증번호 받기'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  // OAuth 계속하기 화면 스타일
  continueHeader: {
    paddingTop: 32,
    paddingHorizontal: 32,
    paddingBottom: 16,
    alignItems: 'center',
  },
  continueTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  continueSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  continueContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  // 이메일 입력 스타일
  emailInput: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    marginBottom: 24,
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
});