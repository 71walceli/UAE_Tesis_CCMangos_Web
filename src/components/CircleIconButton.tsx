import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native-web';
import {colores, styles} from '../theme/appTheme';


interface Props {
  // TODO Ponerle onPress o handlePress
  onPress?: () => void;
  onClick?: () => void;
  title: string;
  color?: string;
  colorTexto?: string;
  icon?: string;
  width?: number;
  textSize?: number;
  tamañoIcon?: number;
  marginH?: number;
  marginV?: number;
  alto?: number;
  disabled?: boolean;
  colorIcono?: string;
  radio?: number;
  margVText?: number;
}

export const CircleIconButton = ({
  onPress,
  onClick,
  title,
  color = colores.LocationBg,
  colorTexto = colores.primario,
  icon,
  width,
  textSize = 20,
  tamañoIcon = 25,
  marginH,
  marginV = 14,
  alto = 60,
  margVText = 10,
  radio = 40,
  disabled = false,
  colorIcono = colores.blanco,
}: Props) => {
  const iconSize = 60;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress || onClick}
      style={{
        height: alto,
        marginHorizontal: marginH,
        backgroundColor: disabled ? "gray" : color,
        marginVertical: marginV,
        flexDirection: 'row',
        borderRadius: radio,
        width,
      }}>
      {icon && (
        <View
          style={{
            padding: 4,
            flexBasis: iconSize,
            flexShrink: 0,
            flexGrow: 0,
            ...styles.centerItems,
            borderRadius: 40,
            backgroundColor: colores.negro,
          }}>
          {/* <Icon name={icon} size={tamañoIcon} color={colorIcono}></Icon> */}
          <i className={icon} style={{ color: colores.blanco, fontSize: 36 }} />
        </View>
      )}
      <View style={{
        padding: 4, 
        //width: "calc( 100% - 60px )", 
        flexBasis: 1,
        flexShrink: 1,
        flexGrow: 1,
        ...styles.centerItems
      }}>
        <Text
          style={{
            //...styles.textButton,
            fontSize: textSize,
            color: colorTexto,
            marginVertical: margVText,
            marginHorizontal: iconSize/2,
            marginLeft: icon ? iconSize/4 : iconSize/2,
            //marginRight: icon ? 20 : 0,
            fontWeight: 'bold',
            alignSelf: 'center',
            //width: "100%",
            //textAlign: icon ? "right" : "center",
          }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
