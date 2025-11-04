import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/themes';

type Filter = 'all' | 'active' | 'completed';

interface FilterTabsProps {
  activeFilter: Filter;
  onFilterChange: (filter: Filter) => void;
  itemsLeft: number;
  onClearCompleted: () => void;
  variant: 'mobile' | 'desktop';
}

const { width } = Dimensions.get('window');

export const FilterTabs: React.FC<FilterTabsProps> = ({
  activeFilter,
  onFilterChange,
  itemsLeft,
  onClearCompleted,
  variant,
}) => {
  const { theme } = useTheme();
  const colors = theme === 'light' ? lightTheme : darkTheme;
  const [hoveredFilter, setHoveredFilter] = useState<Filter | null>(null);

  if (variant === 'desktop') {
    return (
      <View style={[styles.desktopContainer, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.itemsLeft, { color: colors.textSecondary, fontFamily: 'JosefinSans-Regular' }]}>
          {itemsLeft} items left
        </Text>
        
        <View style={styles.desktopTabs}>
          {(['all', 'active', 'completed'] as Filter[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => onFilterChange(filter)}
              onMouseEnter={() => setHoveredFilter(filter)}
              onMouseLeave={() => setHoveredFilter(null)}
            >
              <Text
                style={[
                  styles.desktopTabText,
                  {
                    color: activeFilter === filter ? colors.primary : colors.textSecondary,
                    fontFamily: activeFilter === filter || hoveredFilter === filter ? 'JosefinSans-Bold' : 'JosefinSans-Regular',
                  },
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          onPress={onClearCompleted}
          onMouseEnter={() => setHoveredFilter('clear' as any)}
          onMouseLeave={() => setHoveredFilter(null)}
        >
          <Text style={[
            styles.clearText, 
            { 
              color: colors.textSecondary,
              fontFamily: hoveredFilter === 'clear' ? 'JosefinSans-Bold' : 'JosefinSans-Regular'
            }
          ]}>
            Clear Completed
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Mobile variant
  return (
    <View style={[styles.mobileContainer, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.mobileTopRow}>
        <Text style={[styles.itemsLeft, { color: colors.textSecondary, fontFamily: 'JosefinSans-Regular' }]}>
          {itemsLeft} items left
        </Text>
        
        <TouchableOpacity onPress={onClearCompleted}>
          <Text style={[styles.clearText, { color: colors.textSecondary, fontFamily: 'JosefinSans-Regular' }]}>
            Clear Completed
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.mobileTabs, { backgroundColor: colors.cardBackground }]}>
        {(['all', 'active', 'completed'] as Filter[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.mobileTab,
              activeFilter === filter && styles.mobileTabActive,
            ]}
            onPress={() => onFilterChange(filter)}
          >
            <Text
              style={[
                styles.mobileTabText,
                {
                  color: activeFilter === filter ? colors.primary : colors.textSecondary,
                  fontFamily: activeFilter === filter ? 'JosefinSans-Bold' : 'JosefinSans-Regular',
                },
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  mobileContainer: {
    padding: 16,
    borderRadius: 8,
  },
  mobileTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemsLeft: {
    fontSize: 14,
    fontWeight: '400',
  },
  desktopTabs: {
    flexDirection: 'row',
    gap: 16,
  },
  desktopTabText: {
    fontSize: 14,
    fontWeight: '400',
  },
  mobileTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mobileTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 4,
  },
  mobileTabActive: {
    backgroundColor: 'rgba(192, 88, 243, 0.1)',
  },
  mobileTabText: {
    fontSize: 14,
    fontWeight: '400',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '400',
  },
});