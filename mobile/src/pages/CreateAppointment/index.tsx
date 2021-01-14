import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import {Platform, Alert, TextInput, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {format} from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';
import {useAuth} from '../../hooks/auth';
import api from '../../services/api';
import {Provider} from '../Dashboard/index';

interface RouteParams {
  providerId: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const {user} = useAuth();
  const route = useRoute();
  const {goBack, navigate} = useNavigation();

  const routeParams = route.params as RouteParams;
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [adm, setAdm] = useState(false);
  const [admAppointment, setAdmAppointment] = useState('NoAdmAppointment');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );

  useEffect(() => {
    if (user.email === 'lu@gmail.com') {
      setAdm(true);
    }
  }, [user.email]);

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then((response) => {
        setAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  /*const handleSelectPovider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);*/

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((state) => !state);
  }, []);

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
      if (date) {
        setSelectedDate(date);
      }
    },
    [],
  );

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
        nonUserName: admAppointment,
      });

      navigate('AppointmentCreated', {date: date.getTime()});
    } catch (err) {
      Alert.alert('Erro ao criar o agendamento', `${err}`);
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider, admAppointment]);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({hour}) => hour < 12)
      .map(({hour, available}) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({hour}) => hour >= 12)
      .map(({hour, available}) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Menu Principal</HeaderTitle>

        <UserAvatar source={{uri: user.avatar_url}} />
      </Header>
      <Content>
        <View style={{paddingHorizontal: 20, paddingTop: 20}}>
          {adm && (
            <View>
              <Text
                style={{
                  color: '#f4ede8',
                  fontFamily: 'RobotoSlab-Medium',
                  fontSize: 22,
                  paddingBottom: 20,
                }}>
                Nome do Cliente
              </Text>

              <TextInput
                placeholder="Nome"
                onChangeText={setAdmAppointment}
                placeholderTextColor="#ff9000"
                style={{
                  height: 60,
                  borderRadius: 10,
                  marginBottom: 8,
                  borderWidth: 2,
                  borderColor: '#ff9000',
                  alignItems: 'center',
                  color: '#ff9000',
                  paddingHorizontal: 20,
                }}
              />
            </View>
          )}
        </View>

        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              onChange={handleDateChanged}
              textColor="#f4ede8"
              value={selectedDate}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({hourFormatted, hour, available}) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  available={available}
                  key={hourFormatted}
                  onPress={() => handleSelectHour(hour)}>
                  <HourText selected={selectedHour === hour}>
                    {hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(({hourFormatted, hour, available}) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  available={available}
                  key={hourFormatted}
                  onPress={() => handleSelectHour(hour)}>
                  <HourText selected={selectedHour === hour}>
                    {hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
