<template>
  <div>
    Hello world distribuido

    <div v-if="userData.user">
      <textarea v-model="text" />
    </div>
    <button v-if="userData.user" @click="translate">Traduzir</button>

    <div v-if="userData.user">
      <h3>Minhas traduções</h3>
      <ul>
        <li v-for="(val, key) in data.translates" :key="key">
          <b>Texto original: {{ val.orinalText }}</b>
          |
          <b>Texto traduzido: {{ val.translatedText }}</b>
        </li>
      </ul>
    </div>

    <div v-if="!userData.user">
      <h4>Login</h4>
      <form v-if="!loadingLogin" @submit.prevent="login">
        <div>
          <input
            v-model="loginForm.username"
            required
            type="text"
            placeholder="Login"
          />
        </div>
        <div>
          <input
            v-model="loginForm.password"
            required
            type="password"
            placeholder="Senha"
          />
        </div>
        <div>
          <button type="submit">login</button>
        </div>
      </form>
      <div v-if="loadingLogin">
        <img src="./assets/loading.gif" style="height: 200px; width: 200px" />
      </div>
    </div>
  </div>
</template>

<script setup>
import io from "socket.io-client";
import { onMounted, reactive, ref } from "vue";
import axios from "axios";

const text = ref("");
const loadingLogin = ref(false);
const userData = reactive({ user: null });

const loginForm = reactive({
  username: "0fc437f3-349f-4829-b19e-682b4a43b4ac",
  password: "Teste123$",
});

const socket = io("localhost:3003");

const data = reactive({
  translates: [],
});

const TRANSLATE_CHANNEL = "translate-channel";

const translate = () => {
  console.log(text.value);
  socket.emit(TRANSLATE_CHANNEL, {
    value: text.value,
  });

  text.value = "";
};

const login = async () => {
  try {
    loadingLogin.value = true;
    const userResponse = await axios.post("http://192.168.49.2/auth/login", {
      ...loginForm,
      requestId: new Date().toISOString(),
    });

    userData.user = userResponse.data;
  } catch (error) {
  } finally {
    loadingLogin.value = false;
  }
};

const TRANSLATE_CHANNEL_RESPONSE = "translate-channel-response";

socket.on(TRANSLATE_CHANNEL_RESPONSE, (socketData) => {
  data.translates.push(socketData);
});

onMounted(async () => {
  const translatesResponse = await axios.get("http://localhost:3001/");

  data.translates = translatesResponse.data;
});
</script>
<style scoped></style>
