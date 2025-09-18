/**
 * 인증번호 입력 화면
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface VerificationCodeScreenProps {
  email: string;
  onVerifyCode: (email: string, verificationCode: string) => Promise<boolean>;
  onBack: () => void;
  onResendCode: (email: string) => Promise<boolean>;
  isLoading?: boolean;
}

export function VerificationCodeScreen({
  email,
  onVerifyCode,
  onBack,
  onResendCode,
  isLoading = false,
}: VerificationCodeScreenProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const codeInputRef = useRef<TextInput>(null);

  // 타이머 설정
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // 화면 진입 시 자동 포커스
  useEffect(() => {
    const timer = setTimeout(() => {
      codeInputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // 인증번호 검증
  const validateCode = (code: string): boolean => {
    return /^\d{6}$/.test(code);
  };

  // 인증번호 확인 처리
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setCodeError('인증번호를 입력해주세요.');
      return;
    }

    if (!validateCode(verificationCode.trim())) {
      setCodeError('6자리 숫자를 입력해주세요.');
      return;
    }

    setCodeError('');

    try {
      const success = await onVerifyCode(email, verificationCode.trim());
      if (!success) {
        setCodeError('인증번호가 올바르지 않습니다. 다시 확인해주세요.');
      }
    } catch (error) {
      console.error('인증번호 확인 오류:', error);
      Alert.alert('오류', '인증번호 확인 중 오류가 발생했습니다.');
    }
  };

  // 인증번호 재발송
  const handleResendCode = async () => {
    if (!canResend) return;

    try {
      const success = await onResendCode(email);
      if (success) {
        setResendTimer(60);
        setCanResend(false);
        Alert.alert('완료', '인증번호가 재발송되었습니다.');
      } else {
        Alert.alert('오류', '인증번호 재발송에 실패했습니다.');
      }
    } catch (error) {
      console.error('인증번호 재발송 오류:', error);
      Alert.alert('오류', '인증번호 재발송 중 오류가 발생했습니다.');
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
        <Text style={styles.title}>인증번호 확인</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          <Text style={styles.emailText}>{email}</Text>로{'\n'}
          인증번호를 발송했습니다.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>인증번호 (6자리)</Text>
          <TextInput
            ref={codeInputRef}
            style={[
              styles.codeInput,
              codeError ? styles.inputError : null,
            ]}
            value={verificationCode}
            onChangeText={(text) => {
              // 숫자만 입력 허용, 최대 6자리
              const numbersOnly = text.replace(/[^0-9]/g, '').slice(0, 6);
              setVerificationCode(numbersOnly);
              if (codeError) setCodeError('');
            }}
            placeholder="123456"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={6}
            editable={!isLoading}
            textAlign="center"
            selectTextOnFocus
          />
          {codeError ? (
            <Text style={styles.errorText}>{codeError}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            styles.verifyButton,
            isLoading && styles.disabledButton,
          ]}
          onPress={handleVerifyCode}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
            ) : (
              <Text style={styles.buttonIcon}>✓</Text>
            )}
            <Text style={styles.buttonText}>
              {isLoading ? '인증 중...' : '인증번호 확인'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendInfo}>
            인증번호가 오지 않았나요?
          </Text>
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={!canResend || isLoading}
            style={styles.resendButton}
          >
            <Text style={[
              styles.resendText,
              (!canResend || isLoading) && styles.disabledText
            ]}>
              {canResend 
                ? '인증번호 재발송' 
                : `재발송 (${resendTimer}초)`
              }
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.infoText}>
          인증번호는 5분간 유효합니다.{'\n'}
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
  emailText: {
    fontWeight: 'bold',
    color: '#6c5ce7',
  },
  inputContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 24,
    backgroundColor: 'white',
    width: 200,
    fontWeight: 'bold',
    letterSpacing: 5,
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: '#6c5ce7',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 30,
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
  resendContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resendInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  resendText: {
    fontSize: 14,
    color: '#6c5ce7',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  disabledText: {
    color: '#999',
    textDecorationLine: 'none',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
});
