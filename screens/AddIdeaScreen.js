// //can run but can not take picture

// import React, { useState, useEffect, useRef, useContext } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
// import { Camera } from 'expo-camera';
// import { PeopleContext } from '../PeopleContext';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import * as FileSystem from 'expo-file-system';

// const AddIdeaScreen = () => {
//   const { addIdea } = useContext(PeopleContext);
//   const [text, setText] = useState('');
//   const [cameraPermission, setCameraPermission] = useState(null);
//   const [imageUri, setImageUri] = useState('');
//   const [isCameraReady, setIsCameraReady] = useState(false); // New state to track if the camera is ready
//   const route = useRoute();
//   const navigation = useNavigation();

//   const { personId } = route.params;

//   // Request camera permission on component mount
//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setCameraPermission(status === 'granted');
//     })();
//   }, []);

//   // Ensure the camera is ready before taking a picture
//   const onCameraReady = () => {
//     console.log("Camera is ready"); 
//     setIsCameraReady(true);
//   };

//   // Function to take a picture
//   const takePicture = async () => {
//     if (cameraRef.current && isCameraReady) { // Ensure the camera is ready before taking a picture
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
//         const imagePath = `${FileSystem.documentDirectory}${photo.uri.split('/').pop()}`;
//         await FileSystem.moveAsync({ from: photo.uri, to: imagePath });
//         setImageUri(imagePath);
//       } catch (error) {
//         console.log("Error taking picture:", error);
//         Alert.alert('Error', 'Failed to take picture.');
//       }
//     } else {
//       Alert.alert('Error', 'Camera is not ready.');
//     }
//   };

//   // Function to handle saving the idea
//   const handleSaveIdea = () => {
//     if (!text || !imageUri) {
//       Alert.alert('Error', 'Please provide both a description and an image.');
//       return;
//     }

//     const newIdea = {
//       text,
//       img: imageUri,
//       width: 300, // Arbitrary width
//       height: 450, // Maintain 2:3 aspect ratio
//     };

//     addIdea(personId, newIdea); // Save the idea using context
//     navigation.navigate('IdeaScreen', { personId }); // Navigate back to the idea list
//   };

//   if (cameraPermission === null) {
//     return (
//       <View>
//         <Text>Requesting camera permission...</Text>
//       </View>
//     );
//   }

//   if (cameraPermission === false) {
//     return (
//       <View>
//         <Text>No access to camera</Text>
//       </View>
//     );
//   }

//   // Safety check for Camera.Constants.Type
//   const cameraType = Camera.Constants && Camera.Constants.Type ? Camera.Constants.Type.back : null;

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter idea description"
//         value={text}
//         onChangeText={setText}
//       />
//       {imageUri ? (
//         <Image source={{ uri: imageUri }} style={styles.imagePreview} />
//       ) : (
//         cameraType && (
//           <Camera
//             style={styles.camera}
//             type={cameraType} // Only render the camera if Camera.Constants.Type is available
//             ref={cameraRef}
//             onCameraReady={onCameraReady} // Ensure the camera is ready before taking a picture
//           />
//         )
//       )}
//       <Button title="Take Picture" onPress={takePicture} />
//       <View style={styles.buttonContainer}>
//         <Button title="Save" onPress={handleSaveIdea} />
//         <Button title="Cancel" onPress={() => navigation.goBack()} color="red" />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     justifyContent: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     fontSize: 16,
//     marginBottom: 20,
//   },
//   camera: {
//     width: '100%',
//     height: 300,
//     marginBottom: 20,
//   },
//   imagePreview: {
//     width: 300,
//     height: 450, // Maintain the 2:3 aspect ratio
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     marginTop: 20,
//   },
// });

// export default AddIdeaScreen;

//add camera ,but have some error
import { Camera} from "expo-camera";
import * as FileSystem from 'expo-file-system';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { PeopleContext } from '../PeopleContext';

export default function AddIdeaScreen() {
  const { addIdea } = useContext(PeopleContext);
  const [hasPermission, setHasPermission] = useState(null); // Handling camera permissions
  const [cameraRef, setCameraRef] = useState(null); // Camera reference
  const [facing, setFacing] = useState("back"); // Front or back camera
  const [photo, setPhoto] = useState(null); // Store the captured photo
  const [text, setText] = useState(''); // Store the idea description

  // Request camera permission
  useEffect(() => {
    console.log(Camera);
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Function to take a picture
  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.takePictureAsync();
        const imagePath = `${FileSystem.documentDirectory}${data.uri.split('/').pop()}`;
        await FileSystem.moveAsync({ from: data.uri, to: imagePath });
        setPhoto(imagePath);
      } catch (error) {
        console.log("Error taking picture:", error);
        Alert.alert('Error', 'Failed to take picture.');
      }
    }
  };

  // Function to toggle between front and back cameras
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // Function to handle saving the idea
  const handleSaveIdea = () => {
    if (!text || !photo) {
      Alert.alert('Error', 'Please provide both a description and an image.');
      return;
    }

    const newIdea = {
      text,
      img: photo,
      width: 300, // Arbitrary width
      height: 450, // Maintain 2:3 aspect ratio
    };

    addIdea(newIdea); // Save the idea using context
  };

  // If permission is not granted
  if (hasPermission === null) {
    return <View><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter idea description"
        value={text}
        onChangeText={setText}
      />
      {!photo ? (
        <Camera
          style={styles.camera}
          type={facing}
          ref={(ref) => setCameraRef(ref)}
        >
          <View style={styles.cameraContainer}>
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <Text style={styles.flipText}> Flip </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Text style={styles.captureText}> Take Picture </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <Image source={{ uri: photo }} style={styles.imagePreview} />
      )}
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={handleSaveIdea} />
        <Button title="Cancel" color="red" onPress={() => setPhoto(null)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  camera: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  imagePreview: {
    width: 300,
    height: 450, // Maintain the 2:3 aspect ratio
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 30,
  },
  flipButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  flipText: {
    fontSize: 18,
    color: '#000',
  },
  captureButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 50,
    marginBottom: 20,
  },
  captureText: {
    fontSize: 18,
    color: '#000',
  },
});

