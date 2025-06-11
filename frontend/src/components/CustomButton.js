import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../styles/theme';

const CustomButton = ({ title, onPress, style, textStyle }) => {
  const { colors, typography, spacing, borderRadius, shadows } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.light,
    },
    buttonText: {
      color: '#FFFFFF',
      ...typography.h3,
    },
  });

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton; 