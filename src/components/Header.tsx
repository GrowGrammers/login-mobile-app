/**
 * Header - 뒤로가기 버튼이 있는 공통 헤더 컴포넌트
 * 여러 화면에서 재사용되는 헤더
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { headerStyles } from '../styles/componentStyles';

interface HeaderProps {
  onBack: () => void;
  title?: string;
  showBackButton?: boolean;
}

export function Header({ onBack, title, showBackButton = true }: HeaderProps) {
  return (
    <View style={headerStyles.header}>
      {showBackButton && (
        <TouchableOpacity
          style={headerStyles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={headerStyles.backButtonText}>←</Text>
        </TouchableOpacity>
      )}
      {title && (
        <View style={headerStyles.titleContainer}>
          <Text style={headerStyles.titleText}>{title}</Text>
        </View>
      )}
      <View style={headerStyles.spacer} />
    </View>
  );
}
