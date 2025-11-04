import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/themes';

interface SearchBarProps {
  searchText: string;
  onSearchChange: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchText, onSearchChange }) => {
  const { theme } = useTheme();
  const colors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.background,
            fontFamily: 'JosefinSans-Regular',
          },
        ]}
        placeholder="Search todos..."
        placeholderTextColor={colors.placeholder}
        value={searchText}
        onChangeText={onSearchChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 4,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    
  },
});