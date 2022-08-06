import * as React from 'react';
import { Button, ImageBackground } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { StackActions } from '@react-navigation/native';
export default function Login({navigation}) {
    const [username, setUsername] = React.useState("");
    const [password,setPassword] = React.useState("");
    const [error,setError] = React.useState(false)
    const handlePress =async()=>{
        try {
            const response = await fetch('https://62ec155455d2bd170e7c5781.mockapi.io/register/');
            const json = await response.json();
                for (const iterator of json) {
                    if(iterator.username === username && iterator.password === password){
                        await AsyncStorage.setItem('isLoggedIn', 'true')
                      navigation.navigate('Dashboard',{username: username})
                        
                    }else{
                        setError(true)
                    }
                    
                }
          } catch (error) {
            alert('errr')
          }
    }
    const handleRegister = ()=>{
        navigation.navigate('RegisterScreen');
    }
    const image = {uri :'https://c.neh.tw/thumb/f/720/5276054732144640.jpg'};
    const navigationCheck = useNavigation();
    React.useEffect(() => {
        getData()
    }, [])
    const getData = async () => {
        try {
          const value = await AsyncStorage.getItem('isLoggedIn')
          const user = await AsyncStorage.getItem('username')
          if(value === 'true') {
            navigationCheck.dispatch(StackActions.replace('Dashboard', {
                username: user,
              }))
          }else{
            navigationCheck.setOptions({
                title:'Login',
                headerLeft: null
            })
          }
        } catch(e) {
          alert(e)
        }
      }
  return (
    <ImageBackground resizeMode="cover"  source={image} style={styles.container}>
        <Text style={{position:'absolute',color:'white',textDecorationLine:'underline',top:5,fontSize:25,fontWeight:'500'}}>Amaze Shop</Text>
        <View>
            <Text style={styles.title}>Login</Text>
        <TextInput
            value={username}
            onChangeText={(val)=>setUsername(val)}
            placeholder="username"
            style={styles.input}
        />
        <TextInput
            value={password}
            secureTextEntry
            onChangeText={(val)=>setPassword(val)}
            placeholder="password"
            style={styles.input}
        />
        <Button
            title='Login'
            onPress={handlePress}
            style={styles.button}
        />
        <Text style={styles.link} onPress={handleRegister}>New user? Sign Up!</Text>
        </View>
        <Snackbar
        visible={error}
        onDismiss={()=> setError(false)}
        >
        Invalid Username or Password
      </Snackbar>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    container:{
        padding:4,
        justifyContent:'center',
        alignItems:'center',
        justifyContent:'center',
        flex:1     
    },
    input:{
        borderWidth:2,
        padding:2,
        margin:5,
        borderRadius:5,
        width:200,
        height:50,
        backgroundColor:'white',
        borderColor:'transparent'
    },
    link:{
        textDecorationLine:'underline',
        padding:4,
        textAlign:'center'
    },
    title:{
        fontSize:20,
        textAlign:'center',
        fontWeight:'700',
        margin:4        
    },
    button:{
        backgroundColor:'red',
        borderWidth:2,
        borderColor:'black'
    }
});
