import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, useColorScheme, Image, ImageSourcePropType,Platform } from "react-native";
import ImageViewer from "./components/ImageViewer";
import MyButton from "./components/MyButton";
const PlaceholderImage = require("./assets/images/background-image.png");
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import IconButton from "./components/IconButton";
import CircleButton from "./components/CircleButton";
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from './components/EmojiList';
import EmojiSticker from "./components/EmojiSticker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from "react-native-view-shot";
import domtoimage from 'dom-to-image';



export default function App() {
  const imageRef=useRef(null)
  const [status, requestPermission] = MediaLibrary.usePermissions();  const[bounderies,setBounderies]=useState({width:0,height:0})
  const [pickedEmoji, setPickedEmoji] = useState<ImageSourcePropType|null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState<undefined | string>(
    undefined
  );
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("You did not select any image.");
    }
  };
  const onReset = () => {
    setPickedEmoji(null)
    setSelectedImage(undefined)
    setShowAppOptions(false);
  };
  const onAddSticker = () => {
   setIsModalVisible(true);
  };
  const onSaveImageAsync = async () => {
    if (Platform.OS!=="web"){

    
    try {
      const localUri = await captureRef(imageRef, {
        height: bounderies.height,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("Image save to library!");
      }
    } catch (e) {
      console.log(e);
    }
  }else{
    try{
      if(imageRef.current){
      const dataUrl= await domtoimage.toJpeg(imageRef.current,{
        quality:0.95,
        width:bounderies.width,
        height:bounderies.height
      })
      const link=document.createElement("a")
      link.download="sticker-smash.jpeg"
      link.href=dataUrl;
      link.click()
    }
  }catch(error){
  
  }
  }
  }
  
  const onModalClose = () => {
    setIsModalVisible(false);
  }
  if(status===null){
    requestPermission();
  }
  return (
    <GestureHandlerRootView style={styles.container}>
      <View  style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
        <ImageViewer
        onLayout={(e)=>{
          setBounderies({width:e.nativeEvent.layout.width,height:e.nativeEvent.layout.height})
        }}
          placeHolderImageSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
        {pickedEmoji && <EmojiSticker bounderies={bounderies} imageSize={40} stickerSource={pickedEmoji} />}
        </View>
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <MyButton label="Press Me" theme="primary" onPress={pickImageAsync} />
          <MyButton
            label="Press Me2"
            theme="secondary"
            onPress={() => {
              setShowAppOptions(true);
            }}
          />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>

      <Text style={{ color: "#fff" }}>
        Open up App.js to start working on your app!
      </Text>
      {/* <Button title="Toggle Color Scheme" onPress={()=>{}}></Button> */}
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
