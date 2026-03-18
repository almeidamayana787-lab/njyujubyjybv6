
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configuração do canal de notificação (necessário para Android)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NubankScreen() {
  const [connectionStatus, setConnectionStatus] = useState('Conectando...');

  useEffect(() => {
    // Permissões de notificação
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Você precisa permitir as notificações para o app funcionar!');
        setConnectionStatus('Permissão de notificação negada');
      }
    }

    requestPermissions();

    const pollNotifications = setInterval(async () => {
      try {
        // Substitua pela sua URL real e token do influencer
        const response = await fetch('https://seu-cassino.com/api/demo/notifications', {
          headers: { 'Authorization': 'Bearer INFLUENCER_TOKEN' }
        });

        if (!response.ok) {
          throw new Error('Falha na requisição: ' + response.status);
        }

        const data = await response.json();

        setConnectionStatus('Conectado');

        if (data.new_pix) {
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Pix recebido!",
              body: `Você recebeu um Pix de R$ ${data.new_pix.amount}.00 de Cash On Pay LTDA.`,
              sound: 'default',
            },
            trigger: null, // Dispara imediatamente
          });
        }
      } catch (error) {
        console.error("Erro no polling:", error);
        setConnectionStatus('Desconectado');
      }
    }, 2000); // Polling a cada 2 segundos

    // Limpeza ao desmontar o componente
    return () => clearInterval(pollNotifications);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nubank</Text>
      <Text style={styles.status}>{connectionStatus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#820ad1', // Roxo Nubank
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: 'white',
  },
});
