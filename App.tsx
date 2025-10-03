import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { RootStackParamList } from './src/types/types';
import SignUpScreen from './src/screens/SignUpScreen';
import SelectImagesScreen from './src/screens/SelectImagesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RenderTemplateScreen from './src/screens/RenderTemplateScreen';
import ChooseTemplateScreen from './src/screens/ChooseTemplateScreen';
import PropertyFormScreen from './src/screens/PropertyFormScreen';
import PreviewScreen from './src/screens/templates/PreviewScreen';
import SoldOutDaysScreen from './src/screens/templates/SoldOutDaysScreen';
import QuadrantScreen from './src/screens/templates/QuadrantScreen';
import QuadrantSquareScreen from './src/screens/templates/QuadrantSquareScreen';
import ThreeMainImageScreen from './src/screens/templates/ThreeMainImageScreen';
import Toast from 'react-native-toast-message';
// import { ProfileProvider } from './src/context/ProfileContext';

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

// export default function App() {
//   return (
//     <>
//       <NavigationContainer>
//         <Stack.Navigator
//           initialRouteName="SignUpScreen"
//           screenOptions={{ headerBackTitle: "" }}
//         >
//           <Stack.Screen
//             name="SignUpScreen"
//             component={SignUpScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="ProfileScreen"
//             component={ProfileScreen}
//             options={{ headerTitle: "Editar Perfil" }}
//           />
//           <Stack.Screen
//             name="ChooseTemplate"
//             component={ChooseTemplateScreen}
//             options={{ headerTitle: "Escolha o template" }}
//           />
//           <Stack.Screen name="PropertyForm" component={PropertyFormScreen} />
//           <Stack.Screen name="PreviewScreen" component={PreviewScreen} />
//           <Stack.Screen name="SoldOutDays" component={SoldOutDaysScreen} />
//           <Stack.Screen name="Quadrant" component={QuadrantScreen} />
//           <Stack.Screen name="QuadrantSquare" component={QuadrantSquareScreen} />
//           <Stack.Screen name="ThreeMainImage" component={ThreeMainImageScreen} />
//           <Stack.Screen name="RenderTemplate" component={RenderTemplateScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>

//       {/* Toast precisa estar FORA do NavigationContainer */}
//       <Toast />
//     </>
//   );
// }


export default function App() {
  return (
    <>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUpScreen" screenOptions={{ headerBackTitle: "" }}>
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
        {/* <Stack.Screen name="SelectImages" component={SelectImagesScreen} options={{ headerShown: false }} /> */}
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerTitle: "Editar Perfil" }} />
        <Stack.Screen name="ChooseTemplate" component={ChooseTemplateScreen} options={{ headerTitle: "Escolha o template" }} />
        <Stack.Screen name="PropertyForm" component={PropertyFormScreen} options={{ headerTitle: "" }} />
        <Stack.Screen name="PreviewScreen" component={PreviewScreen} options={{ headerTitle: "" }} />
        <Stack.Screen name="SoldOutDays" component={SoldOutDaysScreen} options={{ headerTitle: "" }} />
        <Stack.Screen name="Quadrant" component={QuadrantScreen} options={{ headerTitle: "" }} />
        <Stack.Screen name="QuadrantSquare" component={QuadrantSquareScreen} options={{ headerTitle: "" }} />
        <Stack.Screen name="ThreeMainImage" component={ThreeMainImageScreen} options={{ headerTitle: "" }} />
        <Stack.Screen name="RenderTemplate" component={RenderTemplateScreen} options={{ headerTitle: "" }} />
      </Stack.Navigator>
    </NavigationContainer>
    <Toast />
    </>
  );
}

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerBackTitle: '' }}>
//         {/* Login fora do drawer */}
//         <Stack.Screen
//           name="SignUpScreen"
//           component={SignUpScreen}
//           options={{ headerShown: false }}
//         />

//         {/* Drawer dentro do Stack */}
//         <Stack.Screen
//           name="AppDrawer"
//           component={AppDrawer}
//           options={{ headerShown: false }}
//         />

//         {/* Telas adicionais que não precisam do drawer */}
//         <Stack.Screen name="PropertyForm" component={PropertyFormScreen} />
//         <Stack.Screen name="PreviewScreen" component={PreviewScreen} />
//         <Stack.Screen name="SoldOutDays" component={SoldOutDaysScreen} />
//         <Stack.Screen name="Quadrant" component={QuadrantScreen} />
//         <Stack.Screen name="RenderTemplate" component={RenderTemplateScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// // Cria um Drawer com as telas principais
// function AppDrawer() {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen
//         name="ChooseTemplate"
//         component={ChooseTemplateScreen}
//         options={{ title: 'Templates' }}
//       />
//       <Drawer.Screen
//         name="ProfileScreen"
//         component={ProfileScreen}
//         options={{ title: 'Editar Perfil' }}
//       />
//       {/* adicione aqui outras telas do drawer */}
//     </Drawer.Navigator>
//   );
// }