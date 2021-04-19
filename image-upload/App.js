import React, { Component } from 'react';
import { View, Modal, TouchableNativeFeedback, Text, Image, Dimensions, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import ImageViewer from 'react-native-image-zoom-viewer';
import ImageZoom from 'react-native-image-pan-zoom';

const images = [
  {
    url: 'https://app.tseh85.com/DemoService/api/v21/support/image?SupportId=43251&IsPreview=false',
    props: {
      headers: {
        Token: "B8ZSXfrbpk5Qc/9oTf+KZHx6hgf5MBL8edwyYvA2VFypvgntWlgmxS9NB7mfysJncp+JoScu0B3u+92ioqvfSQ=="
      }
    }
  }
];

export default class Main extends Component {
  state = {
    index: 0,
    modalVisible: true,
    imageWidth: 100,
    imageHeight: 100,
  };

  render() {
    const imageUri = "https://app.tseh85.com/DemoService/api/v21/support/image?SupportId=43251&IsPreview=false";
    const imageHeaders = {Token: "B8ZSXfrbpk5Qc/9oTf+KZHx6hgf5MBL8edwyYvA2VFypvgntWlgmxS9NB7mfysJncp+JoScu0B3u+92ioqvfSQ=="}
    Image.getSizeWithHeaders(imageUri, imageHeaders, (imageWidth, imageHeight) => { 
      console.log("w:" + imageWidth + ",h:" + imageHeight);
      this.setState({ imageWidth, imageHeight }) 
    });
    return (
      <View style={{ padding: 10 }} >
        
        <ImageZoom cropWidth={Dimensions.get('window').width}
                       cropHeight={Dimensions.get('window').height}
                       imageWidth={this.state.imageWidth}
                       imageHeight={this.state.imageHeight}
                       enableCenterFocus={false}
                       >
                <Image 
                  style={{
                    width: this.state.imageWidth,
                    height: this.state.imageHeight,
                  }}
                  onLoad={(event) => console.log(event.nativeEvent)}
                  source={{
                      uri: "https://app.tseh85.com/DemoService/api/v21/support/image?SupportId=43251&IsPreview=false",
                      headers: {Token: "B8ZSXfrbpk5Qc/9oTf+KZHx6hgf5MBL8edwyYvA2VFypvgntWlgmxS9NB7mfysJncp+JoScu0B3u+92ioqvfSQ=="}
                  }}
                />
        </ImageZoom>
        <Ionicons style={{position: "absolute", top: 30, right: 30}} name="close-outline" size={50} color="black" backgroundColor="white" />
{/*         <Image 
          style={{width:50, height:50}}
          onLoad={(event) => console.log(event.nativeEvent)}
          source={{
              uri: "https://app.tseh85.com/DemoService/api/v21/support/image?SupportId=43251&IsPreview=false",
              headers: {Token: "B8ZSXfrbpk5Qc/9oTf+KZHx6hgf5MBL8edwyYvA2VFypvgntWlgmxS9NB7mfysJncp+JoScu0B3u+92ioqvfSQ=="}
          }}
        />
        <Image 
          style={{width:50, height:50}}
          onLoad={(event) => console.log(event.nativeEvent)}
          source={{
              uri: "https://avatars2.githubusercontent.com/u/7970947?v=3&s=460",
          }}
        /> */}
{/*         <Modal
          visible={this.state.modalVisible}
          transparent={true}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <ImageViewer
            imageUrls={images}
          />
        </Modal> */}
      </View>
    );
  }
}
