/**
 * EmailInputScreen - 이메일 입력 화면
 * 이메일 주소를 입력하고 인증번호를 요청하는 화면
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthState } from '../utils/AuthEventHandler';
import { validateEmail } from '../utils/emailValidationUtils';
import { Header } from '../components/Header';

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
  const [emailError, setEmailError] = useState<string>('');

  // 이메일 변경 핸들러 (유효성 검사 포함)
  const handleEmailChange = (email: string) => {
    onEmailChange(email);
    
    // 입력 중에는 에러 메시지 제거
    if (emailError) {
      setEmailError('');
    }
  };

  // 인증번호 요청 핸들러 (유효성 검사 포함)
  const handleRequestVerification = () => {
    const validation = validateEmail(emailForVerification);
    
    if (!validation.isValid) {
      setEmailError(validation.errorMessage || '올바른 이메일을 입력해주세요.');
      Alert.alert('알림', validation.errorMessage || '올바른 이메일을 입력해주세요.');
      return;
    }
    
    setEmailError('');
    onRequestVerification();
  };
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <Header onBack={onBack} showBackButton={true} />
      
      {/* 콘텐츠 헤더 */}
      <View style={styles.contentHeader}>
        <Text style={styles.headerTitle}>이메일로 계속하기</Text>
        <Text style={styles.headerSubtitle}>이메일로 로그인하거나 가입하세요</Text>
      </View>
      
      {/* 폼 영역 */}
      <View style={styles.formContainer}>
        <View style={styles.formContent}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.emailInput,
                emailError ? styles.emailInputError : null
              ]}
              placeholder="이메일 주소"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={emailForVerification}
              onChangeText={handleEmailChange}
              editable={!authState.isLoading}
            />
            
            {/* 에러 메시지 표시 */}
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>
          
          <TouchableOpacity
            style={[
              styles.submitButton,
              (authState.isLoading || !emailForVerification) && styles.disabledButton
            ]}
            onPress={handleRequestVerification}
            disabled={authState.isLoading || !emailForVerification}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {authState.isLoading ? '인증번호 발송 중...' : '인증번호 받기'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  // 콘텐츠 헤더 스타일 (웹 앱과 동일)
  contentHeader: {
    paddingHorizontal: 32,
    paddingVertical: 64,
    paddingBottom: 16,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'left',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'left',
  },
  // 폼 영역 (웹 앱과 동일)
  formContainer: {
    flex: 1,
    paddingHorizontal: 32,
    paddingBottom: 16,
    marginVertical: 48,
  },
  formContent: {
    flex: 1,
    gap: 24,
  },
  // 입력 컨테이너
  inputContainer: {
    width: '100%',
    marginBottom: 48,
  },
  // 이메일 입력 스타일 (웹 앱과 동일)
  emailInput: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#111827',
  },
  // 에러 상태의 이메일 입력
  emailInputError: {
    borderColor: '#dc2626',
  },
  // 에러 메시지 스타일
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 8,
    textAlign: 'left',
  },
  // 제출 버튼 스타일 (웹 앱과 동일)
  submitButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
});