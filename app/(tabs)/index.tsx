import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  Button,
  Text,
  Alert,
} from 'react-native';
import MapView, { Marker, Callout, MapPressEvent } from 'react-native-maps';

export default function HomeScreen() {
  const [markers, setMarkers] = useState<
    { latitude: number; longitude: number; comment: string; id: number }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMarker, setNewMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [comment, setComment] = useState('');
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
      setMarkers([...markers, { ...newMarker, comment, id: newId }]);
      setNewMarker(null);
      setComment('');
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
      {/* モード切替ボタン */}
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
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
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

      {/* コメント入力モーダル */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>コメントを入力してください</Text>
            <TextInput
              style={styles.input}
              placeholder="例：このあたりで不審者を見ました"
              value={comment}
              onChangeText={setComment}
            />
            <Button title="投稿する" onPress={handleSubmit} />
          </View>
        </View>
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
