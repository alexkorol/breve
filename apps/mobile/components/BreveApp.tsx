import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Card from './ui/card';
import Progress from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Ionicons } from '@expo/vector-icons';

const BreveApp: React.FC = () => {
  const [streak, setStreak] = useState(2);
  const [xp, setXp] = useState(150);
  const [currentView, setCurrentView] = useState('home');

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <ScrollView>
            <View style={styles.cardContainer}>
              <Card>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Today</Text>
                  <Text>{streak} day streak 🔥</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.xpText}>XP: {xp}</Text>
                  <Progress value={xp % 100} />
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.footerLeft}>
                    <Ionicons name="cafe-outline" size={24} color="black" />
                    <Text style={styles.footerText}>Learn C#</Text>
                  </View>
                  <Text style={styles.greatJobText}>Great job!</Text>
                </View>
              </Card>
            </View>
            {/* Add more content for the home view */}
          </ScrollView>
        );
      // Add cases for 'study', 'profile', etc.
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Brĕve</Text>
        <Text style={styles.subtitle}>Master Any Subject with Spaced Repetition</Text>
      </View>

      {renderContent()}

      <View style={styles.tabBar}>
        <Tabs defaultValue="home" style={{ width: '100%' }}>
          <TabsList style={styles.tabsList}>
            <TabsTrigger value="home" onPress={() => setCurrentView('home')}><Ionicons name="book-outline" size={24} color="black" /></TabsTrigger>
            <TabsTrigger value="activity"><Ionicons name="bar-chart-outline" size={24} color="black" /></TabsTrigger>
            <TabsTrigger value="new-pack"><Ionicons name="add-circle-outline" size={24} color="black" /></TabsTrigger>
            <TabsTrigger value="profile" onPress={() => setCurrentView('profile')}><Ionicons name="person-outline" size={24} color="black" /></TabsTrigger>
          </TabsList>
        </Tabs>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2563eb',
  },
  subtitle: {
    textAlign: 'center',
    color: '#4b5563',
  },
  cardContainer: {
    marginBottom: 24,
  },
  cardHeader: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 16,
  },
  xpText: {
    marginBottom: 8,
  },
  cardFooter: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    marginLeft: 8,
  },
  greatJobText: {
    color: 'blue',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  tabsList: {
    display: 'flex',
    width: '100%',
  },
});

export default BreveApp;