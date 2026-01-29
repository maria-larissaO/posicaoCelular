import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [position, setPosition] = useState('Detectando...');

  useEffect(() => {
    // Define a frequência de leitura (em ms)
    Accelerometer.setUpdateInterval(100); // Menor intervalo para mais atualizações

    const subscription = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
      detectPosition(accelerometerData);
    });

    // Limpeza ao desmontar o componente
    return () => subscription && subscription.remove();
  }, []);

  // Função para detectar a posição com base nos dados do acelerômetro
  const detectPosition = ({ x, y, z }) => {
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    const absZ = Math.abs(z);

    // Define as posições com base nos eixos
    if (absZ > absX && absZ > absY) {
      if (z > 0.7) {
        setPosition('Tela para cima');
      } else if (z < -0.7) {
        setPosition('Tela para baixo');
      }
    } else if (absY > absX) {
      if (y > 0.7) {
        setPosition('Em pé (retrato)');
      } else if (y < -0.7) {
        setPosition('De cabeça para baixo');
      }
    } else if (absX > absY) {
      if (x > 0.7) {
        setPosition('Deitado (paisagem esquerda)');
      } else if (x < -0.7) {
        setPosition('Deitado (paisagem direita)');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 Posição do Celular</Text>

      <Text style={styles.position}>{position}</Text>

      <View style={styles.values}>
        <Text>X: {data.x.toFixed(2)}</Text>
        <Text>Y: {data.y.toFixed(2)}</Text>
        <Text>Z: {data.z.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  position: {
    fontSize: 20,
    color: '#007AFF',
    marginBottom: 20,
  },
  values: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
  },
});
