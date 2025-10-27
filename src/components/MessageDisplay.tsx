/**
 * MessageDisplay - 성공/에러 메시지를 표시하는 공통 컴포넌트
 * 다양한 화면에서 메시지 표시에 재사용
 */

import React from 'react';
import { View, Text } from 'react-native';
import { messageDisplayStyles } from '../styles/componentStyles';

export type MessageType = 'success' | 'error' | 'info' | 'warning';

interface MessageDisplayProps {
  message: string;
  type?: MessageType;
  visible?: boolean;
}

export function MessageDisplay({ 
  message, 
  type = 'info', 
  visible = true 
}: MessageDisplayProps) {
  if (!visible || !message) {
    return null;
  }

  const getMessageStyle = () => {
    switch (type) {
      case 'success':
        return [messageDisplayStyles.messageContainer, messageDisplayStyles.successMessage];
      case 'error':
        return [messageDisplayStyles.messageContainer, messageDisplayStyles.errorMessage];
      case 'warning':
        return [messageDisplayStyles.messageContainer, messageDisplayStyles.warningMessage];
      default:
        return [messageDisplayStyles.messageContainer, messageDisplayStyles.infoMessage];
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'success':
        return [messageDisplayStyles.messageText, messageDisplayStyles.successMessageText];
      case 'error':
        return [messageDisplayStyles.messageText, messageDisplayStyles.errorMessageText];
      case 'warning':
        return [messageDisplayStyles.messageText, messageDisplayStyles.warningMessageText];
      default:
        return [messageDisplayStyles.messageText, messageDisplayStyles.infoMessageText];
    }
  };

  return (
    <View style={getMessageStyle()}>
      <Text style={getTextStyle()}>
        {message}
      </Text>
    </View>
  );
}
