/**
 * VerificationCodeScreen - 인증번호 입력 화면
 * 6자리 인증번호 입력, 재발송, 타이머 기능을 제공
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet 
} from 'react-native';
import { AuthManager } from '@growgrammers/auth-core';
import { AuthActions } from '../utils/AuthEventHandler';
import { Header } from '../components/Header';

interface VerificationCodeScreenProps {
  emailForVerification: string;
  onBack: () => void;
  setCurrentAuthManager: (manager: AuthManager) => void;
  setCurrentProvider: (provider: 'email' | 'google' | 'kakao' | 'naver') => void;
  setCurrentScreen: (screen: string) => void;
  emailAuthManager: AuthManager;
  refreshSession: () => Promise<void>;
  onLoginSuccess: () => void;
}

export function VerificationCodeScreen({ 
  emailForVerification, 
  onBack, 
  setCurrentAuthManager, 
  setCurrentProvider, 
  setCurrentScreen: _setCurrentScreen, 
  emailAuthManager, 
  refreshSession,
  onLoginSuccess
}: VerificationCodeScreenProps) {
  const [verificationDigits, setVerificationDigits] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5분 = 300초
  const [canResend, setCanResend] = useState(false);
  const [message, setMessage] = useState('');
  const [_messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // 타이머 효과
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // 인증번호 개별 입력 처리
  const handleDigitChange = (index: number, value: string) => {
    // 숫자만 허용
    if (value && !/^\d$/.test(value)) return;
    
    const newDigits = [...verificationDigits];
    const previousValue = newDigits[index];
    newDigits[index] = value;
    setVerificationDigits(newDigits);
    
    // 값이 입력되었을 때 다음 필드로 이동
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // 값이 지워졌을 때 (이전에 값이 있었고 현재 비어있을 때) 이전 필드로 이동
    else if (!value && previousValue && index > 0) {
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 10);
    }
    
    // 6자리가 모두 입력되면 자동으로 검증 시도
    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && !isLoading && !canResend) {
      setTimeout(() => {
        handleContinueWithCode(fullCode);
      }, 100);
    }
  };

  // 인증번호로 로그인 처리 (공통 함수)
  const handleContinueWithCode = async (code: string) => {
    if (code.length !== 6) {
      setMessage('❌ 6자리 인증번호를 모두 입력해주세요.');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // 이메일 AuthManager로 전환
      setCurrentAuthManager(emailAuthManager);
      setCurrentProvider('email');
      
      // 상태 전환을 위해 잠시 대기
      await new Promise<void>(resolve => setTimeout(() => resolve(), 50));
      
      // 이메일 AuthManager 사용
      const emailAuthActions = new AuthActions(emailAuthManager);
      const success = await emailAuthActions.loginWithEmail(emailForVerification, code);
      
      if (success) {
        setMessage('✅ 로그인 성공!');
        setMessageType('success');
        
        // 세션 상태 새로고침 후 로그인 완료 화면으로 이동
        setTimeout(async () => {
          console.log('[App] 세션 상태 새로고침 시작');
          await refreshSession();
          onLoginSuccess();
        }, 100);
      } else {
        setMessage('❌ 인증번호가 올바르지 않습니다.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('인증번호 확인 오류:', error);
      setMessage('❌ 인증번호 확인 중 오류가 발생했습니다.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };


  // 시간 포맷팅
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <Header onBack={onBack} showBackButton={true} />
      
      {/* 콘텐츠 헤더 */}
      <View style={styles.contentHeader}>
        <Text style={styles.headerTitle}>인증번호 입력</Text>
        <Text style={styles.headerSubtitle}>({emailForVerification})로 인증번호를 보냈습니다</Text>
      </View>
      
      {/* 인증번호 입력 영역 */}
      <View style={styles.formContainer}>
        <View style={styles.formContent}>
          <View style={styles.inputSection}>
        {/* 6자리 인증번호 입력 필드들 */}
        <View style={styles.digitInputsContainer}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={styles.digitInput}
              placeholder="0"
                  placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              value={verificationDigits[index]}
              onChangeText={(value) => handleDigitChange(index, value)}
                  editable={!isLoading && !canResend}
            />
          ))}
        </View>
        
            {/* 메시지 표시 - 타이머 만료 시에는 표시하지 않음 */}
            {message && !canResend && (
          <Text style={[
                styles.messageText,
                message.includes('✅') ? styles.successMessage : styles.errorMessage
          ]}>
                {message}
          </Text>
            )}
            
            {/* 타이머 - 인증번호 요청 성공 후에만 표시 */}
            {!canResend && (
              <Text style={styles.timerText}>
                {formatTime(timeLeft)}
              </Text>
            )}

            {/* 타이머 만료 안내 - 타이머가 만료된 경우 항상 표시 */}
            {canResend && (
              <View style={styles.expiredContainer}>
                <Text style={styles.expiredText}>5분이 지나 인증번호가 만료되었어요.</Text>
                <Text style={styles.expiredText}>아래 '인증번호가 안 오나요?'에서 다시 인증번호를 요청해주세요.</Text>
              </View>
            )}

            {/* 문의 링크 */}
        <TouchableOpacity 
              style={styles.inquiryButton}
          onPress={() => Alert.alert('알림', '이메일이 오지 않는 경우 문의는 추후 구현 예정입니다.')}
        >
              <Text style={styles.inquiryText}>인증번호가 안 오나요?</Text>
        </TouchableOpacity>
          </View>
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
  inputSection: {
    alignItems: 'center',
    gap: 24,
  },
  // 인증번호 입력 필드 (웹 앱과 동일)
  digitInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  digitInput: {
    width: 48,
    height: 64,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    backgroundColor: 'white',
    textAlign: 'center',
    color: '#111827',
  },
  // 메시지 스타일 (웹 앱과 동일)
  messageText: {
    fontSize: 12,
    textAlign: 'right',
    alignSelf: 'flex-end',
    paddingRight: 16,
  },
  successMessage: {
    color: '#16a34a',
  },
  errorMessage: {
    color: '#dc2626',
  },
  // 타이머 스타일 (웹 앱과 동일)
  timerText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'right',
    alignSelf: 'flex-end',
    paddingRight: 16,
  },
  // 만료 안내 스타일 (웹 앱과 동일)
  expiredContainer: {
    alignSelf: 'flex-end',
    paddingRight: 16,
  },
  expiredText: {
    fontSize: 12,
    color: '#dc2626',
    textAlign: 'right',
    lineHeight: 16,
  },
  // 문의 버튼 스타일 (웹 앱과 동일)
  inquiryButton: {
    marginTop: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  inquiryText: {
    fontSize: 14,
    color: '#6b7280',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});