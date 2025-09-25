/**
 * TokenStatusCard - 자동 토큰 갱신 상태를 표시하는 카드 컴포넌트
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function TokenStatusCard() {
  return (
    <View style={styles.dashboardCard}>
      <Text style={styles.cardTitle}>🤖 자동 토큰 갱신</Text>
      <View style={styles.tokenStatusContainer}>
        <View style={styles.statusIndicator}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>활성화됨</Text>
        </View>
        <View style={styles.statusFeatures}>
          <Text style={styles.statusFeature}>• 토큰 만료 5분 전에 자동 갱신</Text>
          <Text style={styles.statusFeature}>• 1분마다 토큰 상태 확인</Text>
          <Text style={styles.statusFeature}>• API 요청 전 자동 토큰 검증</Text>
          <Text style={styles.statusFeature}>• 갱신 실패 시 자동 로그아웃</Text>
        </View>
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
  tokenStatusContainer: {
    gap: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  statusFeatures: {
    gap: 4,
  },
  statusFeature: {
    fontSize: 12,
    color: '#10b981',
    lineHeight: 16,
  },
});
