/**
 * LoginCompleteScreen - 로그인 완료 화면
 * 로그인 성공 후 계정 연동 또는 서비스 이용 선택
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
//import { Header } from '../components/Header';

interface LoginCompleteScreenProps {
  onConnectNow: () => void;
  onLater: () => void;
}

export function LoginCompleteScreen({
  onConnectNow,
  onLater
}: LoginCompleteScreenProps) {
  return (
    <View style={styles.container}>
      {/* 헤더 (뒤로가기 버튼 없음) */}
      {/* <Header showBackButton={false} />
       */}
      <View style={styles.content}>
        {/* 체크마크 이미지 */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/Successmark.png')}
            style={styles.successImage}
            resizeMode="contain"
          />
        </View>

        {/* 제목 */}
        <Text style={styles.title}>가입완료</Text>

        {/* 안내 텍스트 */}
        <Text style={styles.subtitle}>
          계정 분실에 대비해, 전화번호나 소셜 계정을{'\n'}
          지금 연동해두는 걸 추천드려요.
        </Text>

        {/* 버튼들 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={onConnectNow}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>지금 연동하러 가기</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={onLater}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>다음에 할게요</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 32,
  },
  imageContainer: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  successImage: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 12,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
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
