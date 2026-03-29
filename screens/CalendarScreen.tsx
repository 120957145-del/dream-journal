import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Dream } from '../types';
import { Calendar, LocaleConfig } from 'react-native-calendars';

type CalendarScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Calendar'>;

interface Props {
  navigation: CalendarScreenNavigationProp;
  dreams: Dream[];
}

LocaleConfig.locales['zh'] = {
  monthNames: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ],
  monthNamesShort: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ],
  dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
  today: '今天',
};
LocaleConfig.defaultLocale = 'zh';

const CalendarScreen: React.FC<Props> = ({ navigation, dreams }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const getDreamDates = () => {
    const markedDates: Record<
      string,
      { marked: boolean; dotColor: string; selected?: boolean; selectedColor?: string }
    > = {};

    dreams.forEach((dream) => {
      const date = dream.date.split('T')[0];
      markedDates[date] = {
        marked: true,
        dotColor: '#e94560',
      };
    });

    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#e94560',
    };

    return markedDates;
  };

  const getDreamsForSelectedDate = () => {
    return dreams.filter((dream) => dream.date.split('T')[0] === selectedDate);
  };

  const getMoodIcon = (mood: Dream['mood']) => {
    const icons: Record<Dream['mood'], string> = {
      great: '😊',
      good: '🙂',
      neutral: '😐',
      bad: '😔',
      terrible: '😢',
    };
    return icons[mood];
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const selectedDreams = getDreamsForSelectedDate();

  const renderDreamItem = ({ item }: { item: Dream }) => (
    <TouchableOpacity
      style={styles.dreamCard}
      onPress={() => navigation.navigate('DreamDetail', { dream: item })}
    >
      <View style={styles.dreamHeader}>
        <Text style={styles.dreamTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.moodIcon}>{getMoodIcon(item.mood)}</Text>
      </View>
      <Text style={styles.dreamTime}>{formatTime(item.date)}</Text>
      <Text style={styles.dreamContent} numberOfLines={2}>
        {item.content}
      </Text>
      {item.isLucid && (
        <View style={styles.lucidBadge}>
          <Text style={styles.lucidText}>✨ 清醒梦</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        markedDates={getDreamDates()}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          backgroundColor: '#1a1a2e',
          calendarBackground: '#1a1a2e',
          textSectionTitleColor: '#888',
          selectedDayBackgroundColor: '#e94560',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#e94560',
          dayTextColor: '#ffffff',
          textDisabledColor: '#555',
          dotColor: '#e94560',
          selectedDotColor: '#ffffff',
          arrowColor: '#e94560',
          monthTextColor: '#ffffff',
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
        }}
      />

      <View style={styles.dreamsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedDreams.length > 0
              ? `${selectedDreams.length} 个梦境`
              : '没有梦境'}
          </Text>
        </View>

        {selectedDreams.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🌙</Text>
            <Text style={styles.emptyText}>这一天没有记录梦境</Text>
          </View>
        ) : (
          <FlatList
            data={selectedDreams}
            renderItem={renderDreamItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  dreamsSection: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    gap: 12,
  },
  dreamCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  dreamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dreamTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  moodIcon: {
    fontSize: 22,
    marginLeft: 8,
  },
  dreamTime: {
    color: '#888',
    fontSize: 13,
    marginBottom: 8,
  },
  dreamContent: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
  },
  lucidBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ffd700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lucidText: {
    color: '#1a1a2e',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});

export default CalendarScreen;
