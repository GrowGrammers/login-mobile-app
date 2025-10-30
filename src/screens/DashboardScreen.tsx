/**
 * DashboardScreen - 로그인 후 대시보드 화면
 * 사용자 정보, 토큰 상태, 디버그 정보를 표시
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LoginButton } from '../components/LoginButton';
import { UserInfoCard } from '../components/UserInfoCard';
import { TokenStatusCard } from '../components/TokenStatusCard';
import { DebugInfoCard } from '../components/DebugInfoCard';
import { AuthState } from '../utils/AuthEventHandler';

interface DashboardScreenProps {
  authState: AuthState;
  currentProvider: 'email' | 'google' | 'kakao' | 'naver';
  onLogout: () => void;
}

export function DashboardScreen({ 
  authState, 
  currentProvider, 
  onLogout 
}: DashboardScreenProps) {
  return (
    <View style={styles.dashboardContainer}>
      {/* 헤더 */}
      <View style={styles.dashboardHeader}>
        <Text style={styles.dashboardTitle}>👋 환영합니다!</Text>
        <View style={styles.logoutButtonContainer}>
          <LoginButton 
            provider="back"
            onPress={onLogout}
            isLoading={authState.isLoading}
            currentProvider={currentProvider}
          />
        </View>
      </View>

      {/* 메인 콘텐츠 */}
      <View style={styles.dashboardContent}>
        {/* 사용자 정보 카드 */}
        <UserInfoCard 
          userInfo={authState.userInfo}
          currentProvider={currentProvider}
        />

        {/* 자동 토큰 갱신 상태 카드 */}
        <TokenStatusCard />

        {/* 디버그 정보 카드 */}
        <DebugInfoCard 
          currentProvider={currentProvider}
          authState={authState}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  dashboardHeader: {
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  logoutButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dashboardContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
});
