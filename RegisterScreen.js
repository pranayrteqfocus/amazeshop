import React from 'react'
import { Button, ImageBackground } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Snackbar } from 'react-native-paper';

export default function RegisterScreen({navigation}) {
    const [username, setUsername] = React.useState("");
    const [password,setPassword] = React.useState("");
    const [passwordCheck,setPasswordCheck] = React.useState("");
    const [success,setSuccess] = React.useState("");
    const [error,setError] = React.useState("")
    const handlePress =()=>{
        if (password !== passwordCheck) {
            setError("Password Not Match");
          } else {
            setError("");
            fetch("https://62ec155455d2bd170e7c5781.mockapi.io/register/", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  username: username,
                  password: passwordCheck
                })
            }).then((response)=>{
                response.status === 201 ? setSuccess(true):setSuccess(false)
            })
    }
}
    const handleLogin = ()=>{
        navigation.navigate('Login');
    }
    const image = {uri :'https://c.neh.tw/thumb/f/720/5276054732144640.jpg'};
  return (
    <ImageBackground resizeMode="cover"  source={image} style={styles.container}>
        <Text style={{position:'absolute',color:'white',textDecorationLine:'underline',top:5,fontSize:25,fontWeight:'500'}}>Amaze Shop</Text>
        <View>
            <Text style={styles.title}>Register</Text>
            <Text  style={{display:error !== '' ? 'flex':'none', color:'red',fontSize:18,backgroundColor:'white',padding:5}}>{error}</Text>
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
        <TextInput
            value={passwordCheck}
            secureTextEntry
            onChangeText={(val)=>setPasswordCheck(val)}
            placeholder="password again"
            style={styles.input}
        />
        <Button
            title='Sign Up'
            onPress={handlePress}
            style={styles.button}
        />
        <Text style={styles.link} onPress={handleLogin}>Already Register? Login!</Text>
        <View>{success ? <Text>Register successfully. Login to Shop!</Text>:null}</View>
        </View>

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