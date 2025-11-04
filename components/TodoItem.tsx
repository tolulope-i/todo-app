import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/themes';
import { LinearGradient } from 'expo-linear-gradient';

interface TodoItemProps {
  todo: {
    _id: string;
    text: string;
    completed: boolean;
  };
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEditStart: (id: string, text: string) => void;
  onEditSave: (id: string) => void;
  onEditCancel: () => void;
  isEditing: boolean;
  editText: string;
  onEditTextChange: (text: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  onToggle, 
  onDelete, 
  onEditStart,
  onEditSave,
  onEditCancel,
  isEditing,
  editText,
  onEditTextChange
}) => {
  const { theme } = useTheme();
  const colors = theme === 'light' ? lightTheme : darkTheme;
  const [isHovered, setIsHovered] = useState(false);

  const handleCheckboxPress = () => {
    onToggle(todo._id, !todo.completed);
  };

  const handleTextPress = () => {
    if (!isEditing && !todo.completed) {
      onEditStart(todo._id, todo.text);
    }
  };

  const handleSave = () => {
    onEditSave(todo._id);
  };

  const handleCancel = () => {
    onEditCancel();
  };

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.cardBackground, 
          borderBottomColor: colors.border,
        },
        isHovered && styles.hoveredContainer
      ]}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={handleCheckboxPress}
      >
        {todo.completed ? (
          <LinearGradient
            colors={['#55DDFF', '#C058F3']}
            style={styles.checkboxCompleted}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.checkmark}>✓</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.checkbox, { borderColor: colors.border }]} />
        )}
      </TouchableOpacity>
      
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={[
              styles.editInput,
              {
                color: colors.text,
                fontFamily: 'JosefinSans-Regular',
              },
            ]}
            value={editText}
            onChangeText={onEditTextChange}
            autoFocus
            onSubmitEditing={handleSave}
            onBlur={handleCancel}
          />
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={[styles.saveText, { color: colors.primary, fontFamily: 'JosefinSans-Bold' }]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.textContainer} 
          onPress={handleTextPress}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Text
            style={[
              styles.text,
              {
                color: todo.completed ? colors.completed : colors.text,
                textDecorationLine: todo.completed ? 'line-through' : 'none',
                fontFamily: 'JosefinSans-Regular',
              },
              isHovered && !todo.completed && styles.hoveredText
            ]}
            numberOfLines={2}
          >
            {todo.text}
          </Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        style={[styles.deleteButton, isHovered && styles.deleteButtonVisible]}
        onPress={() => onDelete(todo._id)}
      >
        <Text style={[styles.deleteText, { color: colors.textSecondary }]}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    minHeight: 60,
    position: 'relative',
  },
  hoveredContainer: {
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  checkboxCompleted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
  hoveredText: {
    fontWeight: '600',
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#C058F3',
    marginRight: 8,
  },
  saveButton: {
    padding: 8,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
    opacity: 0,
  },
  deleteButtonVisible: {
    opacity: 1,
  },
  deleteText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});