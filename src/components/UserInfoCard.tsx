/**
 * UserInfoCard - 사용자 정보를 표시하는 카드 컴포넌트
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UserInfoCardProps {
  userInfo?: {
    email?: string;
    nickname?: string;
  };
  currentProvider: 'email' | 'google' | 'kakao' | 'naver';
}

export function UserInfoCard({ userInfo, currentProvider }: UserInfoCardProps) {
  return (
    <View style={styles.dashboardCard}>
      <Text style={styles.cardTitle}>👤 사용자 정보</Text>
      {userInfo ? (
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>이메일:</Text>
            <Text style={styles.userInfoValue}>{userInfo.email || '미설정'}</Text>
          </View>
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>닉네임:</Text>
            <Text style={styles.userInfoValue}>{userInfo.nickname || '설정되지 않음'}</Text>
          </View>
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>Provider:</Text>
            <Text style={styles.userInfoValue}>{currentProvider.toUpperCase()}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.noUserInfoContainer}>
          <Text style={styles.noUserInfoText}>⚠️ 사용자 정보를 불러올 수 없습니다.</Text>
        </View>
      )}
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
  userInfoContainer: {
    gap: 12,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    minWidth: 80,
  },
  userInfoValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  noUserInfoContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noUserInfoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
