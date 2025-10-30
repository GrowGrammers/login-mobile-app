/**
 * DashboardScreen - 로그인 후 대시보드 화면
 * 사용자 정보, 토큰 상태, 디버그 정보를 표시
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LoginButton } from '../components/LoginButton';
import { UserInfoCard } from '../components/UserInfoCard';
//import { TokenStatusCard } from '../components/TokenStatusCard';
import { DebugInfoCard } from '../components/DebugInfoCard';
import { AuthState } from '../utils/AuthEventHandler';
import { Header } from '../components/Header';

interface DashboardScreenProps {
  authState: AuthState;
  currentProvider: 'email' | 'google' | 'kakao' | 'naver';
  onLogout: () => void;
  onBackToLoginComplete?: () => void;
}

export function DashboardScreen({ 
  authState, 
  currentProvider, 
  onLogout,
  onBackToLoginComplete
}: DashboardScreenProps) {
  return (
    <View style={styles.dashboardContainer}>
      {/* 헤더 (뒤로가기 버튼 있음) */}
      <Header showBackButton={true} onBack={onBackToLoginComplete} />
      
      {/* 대시보드 헤더 */}
      <View style={styles.dashboardHeader}>
        <Text style={styles.dashboardTitle}>👋 환영합니다!</Text>
        <View style={styles.logoutButtonContainer}>
          <LoginButton 
            provider="logout"
            onPress={onLogout}
            isLoading={authState.isLoading}
            currentProvider={currentProvider}
          />
        </View>
      </View>

      {/* 메인 콘텐츠 (스크롤 가능) */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.dashboardContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 사용자 정보 카드 */}
        <UserInfoCard 
          userInfo={authState.userInfo}
          currentProvider={currentProvider}
        />

        {/* 자동 토큰 갱신 상태 카드 */}
        {/* <TokenStatusCard /> */}

        {/* 디버그 정보 카드 */}
        <DebugInfoCard 
          currentProvider={currentProvider}
          authState={authState}
        />
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  dashboardContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40, // 하단 여백 추가
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
});
