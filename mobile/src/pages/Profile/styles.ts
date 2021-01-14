import styled from 'styled-components/native';
import {Platform} from 'react-native';

interface UserAvatarProps {
  isNull: string;
}

export const Container = styled.ScrollView`
  flex: 1;
  padding: 0 30px ${Platform.OS === 'android' ? 50 : 40}px;
  position: relative;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 40px;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: 32px;
`;

export const UserAvatar = styled.Image<UserAvatarProps>`
  border-color: ${(props) => (props.isNull ? '#ff9000' : '#3e3b47')};
  border-width: 1px;
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;
