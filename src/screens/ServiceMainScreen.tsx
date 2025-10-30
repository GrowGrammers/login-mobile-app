/**
 * ServiceMainScreen - 서비스 메인 화면
 * 실제 서비스의 메인 페이지 (임시)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Header } from '../components/Header';

interface ServiceMainScreenProps {
  isAuthenticated: boolean;
  onGoToDashboard: () => void;
  onLogout: () => void;
  onGoToLogin: () => void;
}

export function ServiceMainScreen({
  isAuthenticated,
  onGoToDashboard,
  onLogout,
  onGoToLogin
}: ServiceMainScreenProps) {
  return (
    <View style={styles.container}>
      {/* 헤더 (뒤로가기 버튼 없음) */}
      <Header showBackButton={false} />
      
      <View style={styles.content}>
        <View style={styles.mainContent}>
          {/* 제목 */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>서비스 메인 페이지</Text>
            <Text style={styles.subtitle}>
              로그인 모듈 테스트용 임시 페이지
            </Text>
          </View>

          {/* 안내 메시지 */}
          <View style={styles.infoCard}>
            <View style={styles.infoContent}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoText}>
                  실제 서비스 메인 페이지가 구현되면 이 페이지는 제거됩니다.{'\n'}
                  로그인 모듈의 흐름을 테스트하기 위한 임시 페이지입니다.
                </Text>
              </View>
            </View>
          </View>

          {/* 버튼 영역 */}
          <View style={styles.buttonContainer}>
            {isAuthenticated ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={onGoToDashboard}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryButtonText}>회원정보 확인</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={onLogout}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>로그아웃</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={onGoToLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>로그인하러 가기</Text>
              </TouchableOpacity>
            )}
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  mainContent: {
    maxWidth: 512,
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 24,
    marginBottom: 32,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#111827',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});

