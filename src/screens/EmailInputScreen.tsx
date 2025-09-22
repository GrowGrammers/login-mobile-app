/**
 * 이메일 입력 및 인증번호 요청 화면
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface EmailInputScreenProps {
  onRequestVerification: (email: string) => Promise<boolean>;
  onBack: () => void;
  isLoading?: boolean;
}

export function EmailInputScreen({
  onRequestVerification,
  onBack,
  isLoading = false,
}: EmailInputScreenProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // 이메일 유효성 검사
  const validateEmail = (emailAddress: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress);
  };

  // 인증번호 요청 처리
  const handleRequestVerification = async () => {
    // 이메일 입력 확인
    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요.');
      return;
    }

    // 이메일 형식 확인
    if (!validateEmail(email.trim())) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setEmailError('');

    try {
      const success = await onRequestVerification(email.trim());
      if (!success) {
        setEmailError('인증번호 요청에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('인증번호 요청 오류:', error);
      setEmailError('인증번호 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>이메일 로그인</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          이메일을 입력하시면 인증번호를 보내드립니다.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>이메일 주소</Text>
          <TextInput
            style={[
              styles.emailInput,
              emailError ? styles.inputError : null,
            ]}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            placeholder="example@email.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            styles.requestButton,
            isLoading && styles.disabledButton,
          ]}
          onPress={handleRequestVerification}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
            ) : (
              <Text style={styles.buttonIcon}>📧</Text>
            )}
            <Text style={styles.buttonText}>
              {isLoading ? '인증번호 발송 중...' : '인증번호 요청'}
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.infoText}>
          입력하신 이메일로 6자리 인증번호가 발송됩니다.{'\n'}
          인증번호가 오지 않으면 스팸 메일함을 확인해주세요.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6c5ce7',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 5,
  },
  requestButton: {
    backgroundColor: '#6c5ce7',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  spinner: {
    marginRight: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
});
