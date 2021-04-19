import React, { Component } from 'react';
import { View, Modal, TouchableNativeFeedback, Text, Image } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

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
    modalVisible: true
  };

  render() {
    return (
      <View style={{ padding: 10 }} >
        <Text>Test</Text>
        <Image 
          style={{width:50, height:50}}
          onLoad={(event) => console.log(event.nativeEvent)}
          source={{
              uri: "https://app.tseh85.com/DemoService/api/v21/support/image?SupportId=43251&IsPreview=false",
              headers: {"Token": "B8ZSXfrbpk5Qc/9oTf+KZHx6hgf5MBL8edwyYvA2VFypvgntWlgmxS9NB7mfysJncp+JoScu0B3u+92ioqvfSQ=="}
          }}
        />
        <Image 
          style={{width:50, height:50}}
          onLoad={(event) => console.log(event.nativeEvent)}
          source={{
              uri: "https://avatars2.githubusercontent.com/u/7970947?v=3&s=460",
          }}
        />
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
