import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  return (
    <View style={[styles.container, isOwn && styles.ownContainer]}>
      <View style={[styles.bubble, isOwn && styles.ownBubble]}>
        <Text style={[styles.text, isOwn && styles.ownText]}>
          {message.content}
        </Text>
        <Text style={[styles.time, isOwn && styles.ownTime]}>
          {new Date(message.createdAt).toLocaleTimeString('sv-SE', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    alignItems: 'flex-start',
  },
  ownContainer: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 12,
  },
  ownBubble: {
    backgroundColor: '#1F3C58',
  },
  text: {
    fontSize: 16,
    color: '#111827',
  },
  ownText: {
    color: '#fff',
  },
  time: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  ownTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});










