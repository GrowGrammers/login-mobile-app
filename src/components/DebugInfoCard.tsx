/**
 * DebugInfoCard - 디버그 정보를 표시하는 카드 컴포넌트
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthState } from '../utils/AuthEventHandler';

interface DebugInfoCardProps {
  currentProvider: 'email' | 'google' | 'kakao' | 'naver';
  authState: Pick<AuthState, 'isLoading' | 'isOAuthInProgress' | 'lastEvent'>;
}

export function DebugInfoCard({ currentProvider, authState }: DebugInfoCardProps) {
  return (
    <View style={styles.dashboardCard}>
      <Text style={styles.cardTitle}>🔍 디버그 정보</Text>
      <View style={styles.debugInfoContainer}>
        <Text style={styles.debugInfoText}>
          • 로그인 Provider: {currentProvider.toUpperCase()}{'\n'}
          • 로딩 상태: {authState.isLoading ? 'YES' : 'NO'}{'\n'}
          • OAuth 진행 중: {authState.isOAuthInProgress ? 'YES' : 'NO'}{'\n'}
          • 마지막 이벤트: {authState.lastEvent?.status || 'NONE'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dashboardCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  debugInfoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  debugInfoText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});
