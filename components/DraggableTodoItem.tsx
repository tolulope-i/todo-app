import React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { TodoItem } from './TodoItem';

// This is a simplified version - you'd need to implement full drag & drop
// with react-native-gesture-handler and react-native-reanimated
export const DraggableTodoItem = (props: any) => {
  return <TodoItem {...props} />;
};