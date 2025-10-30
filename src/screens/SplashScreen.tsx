/**
 * SplashScreen - 앱 시작 화면
 * 앱의 첫 화면으로 시작하기 버튼을 제공
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LoginButton } from '../components/LoginButton';

interface SplashScreenProps {
  onStartApp: () => void;
}

export function SplashScreen({ onStartApp }: SplashScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.splashContainer}>
        <View style={styles.splashButtonContainer}>
          <LoginButton 
            provider="start"
            onPress={onStartApp}
            isLoading={false}
          />
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
  splashContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 32,
  },
  splashButtonContainer: {
    width: '100%',
    maxWidth: 400,
  },
});
