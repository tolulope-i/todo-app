import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={toggleTheme}
    >
      <Image 
        source={theme === 'light' 
          ? require('../assets/images/icon-moon.png')
          : require('../assets/images/icon-sun.png')
        }
        style={styles.icon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
});