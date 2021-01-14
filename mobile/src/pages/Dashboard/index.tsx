import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {useAuth} from '../../hooks/auth';
import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProviderContainer,
  ProviderAvatar,
  ProviderInfo,
  ProviderName,
  ProviderMeta,
  ProviderMetaText,
  BackButton,
  ProvidersListTitle,
} from './styles';
import api from '../../services/api';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);

  const {user, signOut} = useAuth();
  const {navigate} = useNavigation();

  useEffect(() => {
    api
      .get('providers/87f935db-ade3-4cf1-9f95-c753ee03ceab', {
        params: {
          provider_id: '87f935db-ade3-4cf1-9f95-c753ee03ceab',
        },
      })
      .then((response) => {
        setProviders(response.data);
      });
  }, [user]);

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const navigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', {providerId});
    },
    [navigate],
  );

  return (
    <Container>
      <Header>
        <BackButton onPress={signOut}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>
          Bem vindo, {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          {user.avatar_url ? (
            <UserAvatar
              isNull={user.avatar_url}
              source={{uri: user.avatar_url}}
            />
          ) : (
            <Icon name="camera" size={30} style={{color: '#ff9000'}} />
          )}
        </ProfileButton>
      </Header>
      <ProvidersListTitle>Agendamentos</ProvidersListTitle>

      <ProviderContainer
        onPress={() => navigateToCreateAppointment(providers.id)}>
        <ProviderAvatar source={{uri: providers.avatar_url}} />

        <ProviderInfo>
          <ProviderName>{providers.name}</ProviderName>

          <ProviderMeta>
            <Icon name="calendar" size={14} color="#ff9000" />
            <ProviderMetaText>Segunda à sexta</ProviderMetaText>
          </ProviderMeta>

          <ProviderMeta>
            <Icon name="clock" size={14} color="#ff9000" />
            <ProviderMetaText>8h às 18h</ProviderMetaText>
          </ProviderMeta>
        </ProviderInfo>
      </ProviderContainer>
      <ProvidersListTitle>Conheça nossos produtos</ProvidersListTitle>
    </Container>
  );
};

export default Dashboard;
