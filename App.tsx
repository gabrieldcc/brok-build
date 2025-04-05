import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './src/types/types';
import SignUpScreen from './src/screens/SignUpScreen';
import SelectImagesScreen from './src/screens/SelectImagesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RenderTemplateScreen from './src/screens/RenderTemplateScreen';
// import { ProfileProvider } from './src/context/ProfileContext';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUpScreen" screenOptions={{ headerBackTitle: ""}}>
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
         <Stack.Screen name="SelectImages" component={SelectImagesScreen} options={{ headerShown: false }}/>
         <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerTitle: "Editar Perfil" }}/>
         <Stack.Screen name="RenderTemplate" component={RenderTemplateScreen} options={{ headerTitle: "" }} />

        {
        /*
         */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}