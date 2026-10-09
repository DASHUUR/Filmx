import { Tabs } from 'expo-router';
import { Platform, Text, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFD700', // Идэвхтэй үеийн өнгө (Алтан)
        headerShown: false, // Дээд гарчиг нуух
        tabBarStyle: {
          backgroundColor: '#121212', // Доод цэсний фон
          borderTopColor: '#333',
          paddingTop: Platform.OS === 'ios' ? 10 : 0,
          height: Platform.OS === 'ios' ? 85 : 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Нүүр',
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24 }}>🏠</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Хайх',
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24 }}>🔍</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}