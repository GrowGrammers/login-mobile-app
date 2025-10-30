/**
 * EmailInquiryContent - 이메일 인증번호 문의 바텀시트 내용
 * 웹 앱과 동일한 UI/UX 제공
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

interface EmailInquiryContentProps {
  onResend: () => void;
  isLoading: boolean;
}

export function EmailInquiryContent({
  onResend,
  isLoading
}: EmailInquiryContentProps) {
  return (
    <View style={styles.container}>
      {/* Troubleshooting Steps */}
      <View style={styles.stepsContainer}>
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepText}>스팸함(정크 메일함)을 확인해주세요.</Text>
        </View>
        
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepText}>이메일 수신까지 최대 5분 정도 소요될 수 있습니다.</Text>
        </View>
        
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>이메일 주소를 다시 한 번 확인해주세요.</Text>
        </View>
        
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <Text style={styles.stepText}>여전히 수신되지 않는다면, [인증번호 다시 받기] 버튼을 눌러주세요.</Text>
        </View>
        
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>5</Text>
          </View>
          <Text style={styles.stepText}>계속해서 수신되지 않는 경우, 고객센터에 문의해주세요.</Text>
        </View>
      </View>

      {/* Resend Button */}
      <TouchableOpacity
        style={[
          styles.resendButton,
          (isLoading) && styles.disabledButton
        ]}
        onPress={onResend}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
            <Text style={styles.resendButtonText}>인증번호 발송 중...</Text>
          </View>
        ) : (
          <Text style={styles.resendButtonText}>인증번호 다시 받기</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // 디버깅용 배경색 - 콘텐츠가 보이는지 확인
    // backgroundColor: '#f0f0f0',
  },
  stepsContainer: {
    marginBottom: 32,
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  stepText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  resendButton: {
    backgroundColor: '#111827',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
