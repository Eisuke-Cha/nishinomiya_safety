import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  Button,
  Text,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MapView, { Marker, Callout, MapPressEvent } from 'react-native-maps';

export default function HomeScreen() {
  const [markers, setMarkers] = useState<
    { latitude: number; longitude: number; comment: string; id: number; color: string }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMarker, setNewMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [comment, setComment] = useState('');
  const [selectedColor, setSelectedColor] = useState('red');
  const [isAddMode, setIsAddMode] = useState(true);

  const handleMapPress = (e: MapPressEvent) => {
    if (!isAddMode) return;
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setNewMarker({ latitude, longitude });
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (newMarker) {
      const newId = Date.now();
      setMarkers([
        ...markers,
        { ...newMarker, comment, id: newId, color: selectedColor },
      ]);
      setNewMarker(null);
      setComment('');
      setSelectedColor('red');
      setModalVisible(false);
    }
  };

  const confirmDelete = (id: number) => {
    Alert.alert(
      '削除しますか？',
      'このピンを削除してもよいですか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            setMarkers((prev) => prev.filter((m) => m.id !== id));
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.modeToggle}>
        <Button
          title={isAddMode ? '📍ピン追加モード' : '👁️閲覧モード'}
          color={isAddMode ? '#4CAF50' : '#2196F3'}
          onPress={() => setIsAddMode(!isAddMode)}
        />
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 34.7361,
          longitude: 135.3419,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            pinColor={marker.color}
          >
            <Callout onPress={() => confirmDelete(marker.id)}>
              <View style={{ padding: 5 }}>
                <Text>{marker.comment}</Text>
                <Text style={{ color: 'red', marginTop: 4 }}>🗑️ 削除</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* モーダル（外タップで閉じる） */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setModalVisible(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text>コメントを入力してください</Text>
                <TextInput
                  style={styles.input}
                  placeholder="例：このあたりで不審者を見ました"
                  placeholderTextColor="#666"
                  value={comment}
                  onChangeText={setComment}
                />

                <Text style={{ marginTop: 10 }}>ピンの色を選んでください：</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
                  {['red', 'blue', 'green', 'orange', 'purple'].map((color) => (
                    <View key={color} style={styles.colorOption}>
                      <Text
                        style={[
                          styles.colorCircle,
                          {
                            backgroundColor: color,
                            borderColor: selectedColor === color ? '#000' : 'transparent',
                          },
                        ]}
                        onPress={() => setSelectedColor(color)}
                      />
                    </View>
                  ))}
                </ScrollView>

                <View style={{ marginTop: 10 }}>
                  <Button title="投稿する" onPress={handleSubmit} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    elevation: 10,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  scrollRow: {
    marginTop: 10,
    maxHeight: 50,
  },
  colorOption: {
    marginRight: 12,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeToggle: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    zIndex: 100,
    backgroundColor: '#ffffffcc',
    borderRadius: 8,
    padding: 5,
  },
});

