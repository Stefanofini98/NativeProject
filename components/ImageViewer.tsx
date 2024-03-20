import React from 'react';
import { Image, ImageSourcePropType,StyleSheet,LayoutChangeEvent} from 'react-native';

interface ImageViewerPrps {
    placeHolderImageSource: ImageSourcePropType;
    selectedImage?: string;
    onLayout:(e:LayoutChangeEvent)=>void;
}

const ImageViewer = ({ placeHolderImageSource,selectedImage,onLayout }: ImageViewerPrps) => {
    const imageSource = selectedImage  ? { uri: selectedImage } : placeHolderImageSource;
    return (
        <Image onLayout={onLayout} source={imageSource} style={styles.image} />
    );
}

const styles = StyleSheet.create({
    image: {
        width: 320,
        height: 440,
        borderRadius: 18,
    },
})

export default ImageViewer;