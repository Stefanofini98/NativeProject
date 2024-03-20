import { View, Image, ImageSourcePropType } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';


interface EmojiStickerProps {
    imageSize: number;
    stickerSource: ImageSourcePropType; // Replace 'any' with the appropriate type for stickerSource
    bounderies:{width:number,height:number}
}

export default function EmojiSticker({ imageSize, stickerSource, bounderies }: EmojiStickerProps) {
    const scaleImage = useSharedValue(imageSize);
    const doubleTap=Gesture.Tap().numberOfTaps(2)
    .onStart(()=>{
        if (scaleImage.value !== imageSize * 2) {
            scaleImage.value = scaleImage.value * 2;
          }
    })
    const imageStyle = useAnimatedStyle(() => {
        return{
            width: withSpring(scaleImage.value),
            height: withSpring(scaleImage.value)
        }
    })
    const translateX=useSharedValue(0)
    const translateY=useSharedValue(0)

    const drop =Gesture.Pan().onChange((e)=>{
   
        const imageWidht=scaleImage.value
        const ImageHeight=scaleImage.value
        const maxX= bounderies.width-imageWidht
        const maxY=bounderies.height-ImageHeight

         translateX.value=Math.min(Math.max(translateX.value+e.changeX,0),maxX)
         translateY.value=Math.min(Math.max(translateY.value+e.changeY,0),maxY)

    })
    const containerStyle=useAnimatedStyle(()=>{
        return{
            transform:[
                {translateX:translateX.value},
                {translateY:translateY.value}
            ]
        }
    })
    
    return (
        <GestureDetector gesture={drop}>
        <Animated.View style={[containerStyle,{ top: -440 }]}>
            <GestureDetector gesture={doubleTap}>
            <Animated.Image
                source={stickerSource}
                resizeMode="contain"
                style={[imageStyle,{ width: imageSize, height: imageSize }]}
            />
            </GestureDetector>
        </Animated.View>
        </GestureDetector>
    );
}
