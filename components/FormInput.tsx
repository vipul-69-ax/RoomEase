import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type Props = {
  label?: string;
  labelAbout?: string;
  value?: string;
  onChange?: (text: string) => void;
  inputProps?: TextInputProps;
};

const FormInput = (props: Props) => {
  return (
    <View style={{ marginVertical: 8 }}>
      <Text style={styles.label}>{props.label}</Text>
      {props.labelAbout && (
        <Text style={styles.labelAbout}>{props.labelAbout}</Text>
      )}
      <TextInput
        style={styles.input}
        value={props.value}
        onChangeText={props.onChange}
        {...props.inputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    color: "#aaa",
  },

  labelAbout: {
    color: "#aaa",
    opacity: 0.7,
    marginTop: 4,
  },
  input: {
    width: "100%",
    padding: "3%",
    backgroundColor: "#f7f7f7",
    marginTop: 8,
    borderRadius: 4,
  },
});

export default FormInput;
