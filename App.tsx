import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './screens/HomeScreen';
import AddDreamScreen from './screens/AddDreamScreen';
import DreamDetailScreen from './screens/DreamDetailScreen';
import CalendarScreen from './screens/CalendarScreen';
import { Dream } from './types';

const Stack = createNativeStackNavigator();

const App = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);

  useEffect(() => {
    loadDreams();
  }, []);

  const loadDreams = async () => {
    try {
      const storedDreams = await AsyncStorage.getItem('dreams');
      if (storedDreams) {
        setDreams(JSON.parse(storedDreams));
      }
    } catch (error) {
      console.error('加载梦境失败:', error);
    }
  };

  const saveDreams = async (newDreams: Dream[]) => {
    try {
      await AsyncStorage.setItem('dreams', JSON.stringify(newDreams));
      setDreams(newDreams);
    } catch (error) {
      console.error('保存梦境失败:', error);
    }
  };

  const addDream = (dream: Dream) => {
    const newDreams = [dream, ...dreams];
    saveDreams(newDreams);
  };

  const updateDream = (updatedDream: Dream) => {
    const newDreams = dreams.map(dream => 
      dream.id === updatedDream.id ? updatedDream : dream
    );
    saveDreams(newDreams);
  };

  const deleteDream = (id: string) => {
    const newDreams = dreams.filter(dream => dream.id !== id);
    saveDreams(newDreams);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1a1a2e',
            },
            headerTintColor: '#e94560',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: '#1a1a2e',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            options={{ title: '梦记' }}
          >
            {(props) => <HomeScreen {...props} dreams={dreams} />}
          </Stack.Screen>
          <Stack.Screen
            name="AddDream"
            options={{ title: '记录梦境' }}
          >
            {(props) => <AddDreamScreen {...props} addDream={addDream} />}
          </Stack.Screen>
          <Stack.Screen
            name="DreamDetail"
            options={{ title: '梦境详情' }}
          >
            {(props) => (
              <DreamDetailScreen
                {...props}
                updateDream={updateDream}
                deleteDream={deleteDream}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Calendar"
            options={{ title: '梦境日历' }}
          >
            {(props) => <CalendarScreen {...props} dreams={dreams} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
