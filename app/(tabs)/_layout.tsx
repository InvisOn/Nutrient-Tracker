import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import Colors from '@/constants/Colors';
import { makeModalButton } from '../modal';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Overview',
                    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                    headerRight: makeModalButton(colorScheme)
                }}
            />
            <Tabs.Screen
                name="consumed"
                options={{
                    title: 'Consumed',
                    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                }}
            />
            <Tabs.Screen
                name="food"
                options={{
                    title: 'Foods',
                    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                }}
            />
        </Tabs>
    );
}
