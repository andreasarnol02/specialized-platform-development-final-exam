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

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!name.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }
    if (!email.trim()) {
      setError("Email wajib diisi.");
      return;
    }
    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      // On success the root navigator switches to the main stack automatically.
    } catch (err) {
      setError(getErrorMessage(err, "Gagal daftar. Silakan coba lagi."));
    } finally {
      setSubmitting(false);
    }
  };

  const footer = (
    <Pressable onPress={() => navigation.replace("Login")} hitSlop={8}>
      <Text style={styles.link}>
        Sudah punya akun? <Text style={styles.linkStrong}>Masuk</Text>
      </Text>
    </Pressable>
  );

  return (
    <Screen bg={theme.colors.bg} keyboardAvoiding>
      <BackRow />

      <AuthCard
        title="Daftar ke My Skill"
        subtitle="Buat akun untuk mengakses artikel dan video."
        error={error}
        footer={footer}
      >
        <FormField label="Nama Lengkap" required>
          <TextInput
            style={inputStyle(nameFocused, false)}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholder="Nama Anda"
            placeholderTextColor={theme.colors.muted}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
          />
        </FormField>

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
            placeholder="Minimal 8 karakter"
            placeholderTextColor={theme.colors.muted}
            onFocus={() => setPassFocused(true)}
            onBlur={() => setPassFocused(false)}
          />
        </FormField>

        <AppButton
          variant="primary"
          block
          title={submitting ? "Memproses..." : "Daftar"}
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
