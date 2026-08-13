import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { theme } from "../theme";
import Screen from "../components/Screen";
import AuthCard from "../components/AuthCard";
import BackRow from "../components/BackRow";
import FormField, { inputStyle } from "../components/FormField";
import AppButton from "../components/AppButton";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      // On success the root navigator switches to the main stack automatically.
    } catch (err) {
      setError(getErrorMessage(err, "Email atau kata sandi salah."));
    } finally {
      setSubmitting(false);
    }
  };

  const footer = (
    <Pressable onPress={() => navigation.replace("Register")} hitSlop={8}>
      <Text style={styles.link}>
        Belum punya akun? <Text style={styles.linkStrong}>Daftar</Text>
      </Text>
    </Pressable>
  );

  return (
    <Screen bg={theme.colors.bg} keyboardAvoiding>
      <BackRow />

      <AuthCard
        title="Masuk ke My Skill"
        subtitle="Masuk untuk mengakses artikel dan video."
        error={error}
        footer={footer}
      >
        <FormField label="Email" required>
          <TextInput
            style={inputStyle(emailFocused, false)}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="name@email.com"
            placeholderTextColor={theme.colors.muted}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </FormField>

        <FormField label="Kata Sandi" required>
          <TextInput
            style={inputStyle(passFocused, false)}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder="••••••••"
            placeholderTextColor={theme.colors.muted}
            onFocus={() => setPassFocused(true)}
            onBlur={() => setPassFocused(false)}
          />
        </FormField>

        <AppButton
          variant="primary"
          block
          title={submitting ? "Memproses..." : "Masuk"}
          loading={submitting}
          onPress={handleSubmit}
        />
      </AuthCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  link: {
    fontSize: 13,
    color: theme.colors.inkSoft,
  },
  linkStrong: {
    fontWeight: "700",
    color: theme.colors.greenDark,
  },
});
