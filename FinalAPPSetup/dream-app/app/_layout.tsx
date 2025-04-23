import { Stack } from "expo-router";

export default function RootLayout() {
  return (
      <Stack>
        <Stack.Screen name="index" options={{ title: "💫Nocturnal Navigator💫" }} />
        <Stack.Screen name="gemini" options={{ title: "💫Textual Interpretation💫" }} />
        <Stack.Screen name="gooey" options={{ title: "💫Visual Animation💫" }} />
      </Stack>
  );
}
