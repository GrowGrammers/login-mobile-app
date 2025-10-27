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
import { MessageDisplay, MessageType } from '../components/MessageDisplay';

interface VerificationCodeScreenProps {
  emailForVerification: string;
  onBack: () => void;
  setCurrentAuthManager: (manager: AuthManager) => void;
  setCurrentProvider: (provider: 'email' | 'google' | 'kakao' | 'naver') => void;
  setCurrentScreen: (screen: string) => void;
  emailAuthManager: AuthManager;
  refreshSession: () => Promise<void>;
}

export function VerificationCodeScreen({ 
  emailForVerification, 
  onBack, 
  setCurrentAuthManager, 
  setCurrentProvider, 
  setCurrentScreen, 
  emailAuthManager, 
  refreshSession 
}: VerificationCodeScreenProps) {
  const [verificationDigits, setVerificationDigits] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5분 = 300초
  const [canResend, setCanResend] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('info');
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
  };

  // 계속하기 버튼 처리
  const handleContinue = async () => {
    const code = verificationDigits.join('');
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
        // 메인 화면으로 이동
        setCurrentScreen('login');
        
        // 세션 상태 새로고침
        setTimeout(async () => {
          console.log('[App] 세션 상태 새로고침 시작');
          await refreshSession();
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

  // 인증번호 재발송
  const handleResend = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setMessage('');

    try {
      const emailAuthActions = new AuthActions(emailAuthManager);
      const success = await emailAuthActions.requestEmailVerification(emailForVerification);
      
      if (success) {
        setMessage('✅ 인증번호가 재발송되었습니다.');
        setMessageType('success');
        setTimeLeft(300); // 5분으로 리셋
        setCanResend(false);
        setVerificationDigits(['', '', '', '', '', '']);
      } else {
        setMessage('❌ 인증번호 재발송에 실패했습니다.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('인증번호 재발송 오류:', error);
      setMessage('❌ 인증번호 재발송 중 오류가 발생했습니다.');
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
      <Header onBack={onBack} />
      
      <View style={styles.verificationHeader}>
        <Text style={styles.verificationTitle}>인증번호 입력</Text>
        <Text style={styles.verificationSubtitle}>({emailForVerification})로 인증번호를 보냈습니다</Text>
        <TouchableOpacity onPress={() => setCurrentScreen('email-input')} style={styles.editButton}>
          <Text style={styles.editButtonText}>수정</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.verificationContent}>
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
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              value={verificationDigits[index]}
              onChangeText={(value) => handleDigitChange(index, value)}
              editable={!isLoading}
            />
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.resendButton}
          onPress={handleResend}
          disabled={!canResend || isLoading}
        >
          <Text style={[
            styles.resendButtonText,
            (!canResend || isLoading) && styles.disabledResendText
          ]}>
            {canResend ? '인증번호 다시 받기' : `${formatTime(timeLeft)}`}
          </Text>
        </TouchableOpacity>
        
        {/* 메시지 표시 */}
        <MessageDisplay 
          message={message} 
          type={messageType}
          visible={!!message}
        />
        
        <TouchableOpacity
          style={[
            styles.oauthButton,
            styles.emailOAuthButton,
            (isLoading || verificationDigits.join('').length !== 6) && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={isLoading || verificationDigits.join('').length !== 6}
          activeOpacity={0.8}
        >
          <Text style={styles.oauthButtonText}>
            {isLoading ? '로그인 중...' : '계속하기'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.emailNotReceivedButton}
          onPress={() => Alert.alert('알림', '이메일이 오지 않는 경우 문의는 추후 구현 예정입니다.')}
        >
          <Text style={styles.emailNotReceivedText}>이메일이 안 오나요?</Text>
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
  // 인증번호 입력 화면 스타일
  verificationHeader: {
    paddingTop: 64,
    paddingHorizontal: 32,
    paddingBottom: 16,
    alignItems: 'center',
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  verificationSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
  verificationContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 32,
    alignItems: 'center',
  },
  digitInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  digitInput: {
    width: 48,
    height: 64,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    backgroundColor: '#f9fafb',
    textAlign: 'center',
  },
  resendButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
  },
  resendButtonText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
  disabledResendText: {
    color: '#999',
    textDecorationLine: 'none',
  },
  emailNotReceivedButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  emailNotReceivedText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
    textAlign: 'center',
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