import {
  View,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  processColor,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { Button as RNButton } from "react-native";
import { Button, Dialog, Paragraph, Portal, Provider, Searchbar } from "react-native-paper";
const products = [
  { _id: 1, title: "Item 1", price: 50, quantity: 0 },
  { _id: 2, title: "Item 2", price: 29, quantity: 0 },
  { _id: 3, title: "Item 3", price: 200, quantity: 0 },
];
const resetProduct = [
    { _id: 1, title: "Item 1", price: 50, quantity: 0 },
    { _id: 2, title: "Item 2", price: 29, quantity: 0 },
    { _id: 3, title: "Item 3", price: 200, quantity: 0 },
  ];
class ListItem extends React.Component {
  render() {
    const { item } = this.props;

    return (
      <View
        style={{
          padding: 5,
          flex: 1,
          flexDirection: "row",
          backgroundColor: "white",
          margin: 5,
          borderRadius: 5,
        }}
      >
        <Image
          style={{ width: 80, height: 80, margin: 4 }}
          source={{
            uri: "https://reactnative.dev/img/tiny_logo.png",
          }}
        />
        <View style={{ flexDirection: "column", flex: 1, margin: 4 }}>
          <Text>{item.title}</Text>
          <View
            style={{ marginTop: 13, flexDirection: "row", marginBottom: 1 }}
          >
            <RNButton
              onPress={this.props.handleIncrease}
              title="+"
              style={{
                margin: 2,
                backgroundColor: "grey",
                padding: 5,
                color: "white",
              }}
            />
            <Text style={{ borderWidth: 1, width: 30, marginTop: 8 }}>
              {item.quantity}
            </Text>
            <RNButton
              onPress={this.props.handleDecrease}
              title="-"
              style={{
                margin: 2,
                backgroundColor: "blue",
                padding: 5,
                color: "white",
              }}
            />
          </View>
          <View style={{ flex: 1, flexDirection: "row-reverse" }}>
            <Text>Price:{item.price}</Text>
          </View>
        </View>
      </View>
    );
  }
}

class DashboardScreen extends React.Component {
  state = {
    products,
    username:'',
    isCheckout:false,
    searchVal:'',
    filterData:[],
  };
  onSubtract = (item, index) => {
    const products = [...this.state.products];
    products[index].quantity -= 1;
    this.setState({ products });
  };

  onAdd = (item, index) => {
    const products = [...this.state.products];
    products[index].quantity += 1;
    this.setState({ products });
  };
  getValue = async () => {
    const user = await AsyncStorage.getItem("username");
    this.setState({username:user});
  };

  handleLogout = async () => {
    let logged = await AsyncStorage.getItem("isLoggedIn");
    if (logged === "true") {
      await AsyncStorage.removeItem("isLoggedIn");
      this.props.navigation.navigate("Login");
    }
  };

  componentDidMount() {
    this.getValue();
    this.props.navigation.setOptions({
      headerRight: () => (
        <Button icon={"logout"} onPress={this.handleLogout}></Button>
      ),
    });
  }
 hideDialog = () => this.setState({isCheckout:false});
  handleCheckout = ()=>{
    this.setState({isCheckout:!this.state.isCheckout})
  }
  handleDone = ()=> {
    this.setState({products:resetProduct,filterData:resetProduct,isCheckout:false})
  }
  handleSearch = (val)=>{
   if(val !== ''){
    const newData = this.state.products.filter((item)=>{
        const itemData =item.title ? item.title.toUpperCase() :''.toLowerCase()
        const textData = val.toUpperCase();
        return itemData.indexOf(textData) > -1;
    });
    console.log('serch',newData)
    this.setState({
        searchVal:val,
        filterData:newData
    });
   }else{
    this.setState({searchVal:val});
   }
    // console.log('>>>',)
  }
  render() {
    const { products,filterData } = this.state;
    let totalQuantity = 0;
    let totalPrice = 0;
    if(filterData.length > 0){
        filterData.forEach((item) => {
            totalQuantity += item.quantity;
            totalPrice += item.quantity * item.price;
          });
    }else{
        products.forEach((item) => {
            totalQuantity += item.quantity;
            totalPrice += item.quantity * item.price;
          });
    }
    

    const styles = StyleSheet.create({
        container: {
          padding: 4,
          justifyContent: "center",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        },
        input: {
          borderWidth: 2,
          padding: 2,
          margin: 5,
          borderRadius: 5,
          width: 200,
          height: 50,
          backgroundColor: "white",
          borderColor: "transparent",
        },
        link: {
          textDecorationLine: "underline",
          padding: 4,
          textAlign: "center",
        },
        title: {
          fontSize: 20,
          textAlign: "center",
          fontWeight: "700",
          margin: 4,
          backgroundColor: "white",
          padding: 6,
        },
        button: {
          width: 10,
          flexDirection: "row-reverse",
        },
      });
    
    return (
      <SafeAreaView style={{ flex: 1 }}>
       <Text style={styles.title}>Welcome to Amaze Shop, {this.state.username}</Text>
       <Searchbar
        placeholder="Search for Product"
        onChangeText={this.handleSearch}
        value={this.state.searchVal}
        />
        <FlatList
          data={this.state.filterData.length > 0 ? this.state.filterData : this.state.products}
          renderItem={({ item, index }) => (
            <ListItem
              item={item}
              handleDecrease={() => this.onSubtract(item, index)}
              handleIncrease={() => this.onAdd(item, index)}
            />
          )}
          keyExtractor={(item) => item._id}
        />
        <Provider>
        <Portal>
          <Dialog visible={this.state.isCheckout} onDismiss={this.hideDialog}>
            <Dialog.Title>Notification</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Thank You For Buying</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this.handleDone}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        </Provider>
        <Button mode="contained" onPress={this.handleCheckout} icon="cart" color="blue">Quantity: {totalQuantity} | Price: {totalPrice}</Button>
        
        
      </SafeAreaView>
    );
  }
}

export default DashboardScreen;
