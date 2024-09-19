<template>
  <div>
    Hello world distribuido

    <div>
      <textarea v-model="text" />
    </div>
    <button @click="translate">Traduzir</button>

    <div>
      <h3>Minhas traduções</h3>
      <ul>
        <li v-for="(val, key) in data.translates" :key="key">
          <b>Texto original: {{ val.orinalText }}</b>
          |
          <b>Texto traduzido: {{ val.translatedText }}</b>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import io from "socket.io-client";
import { onMounted, reactive, ref } from "vue";
import axios from "axios";

const text = ref("");

const socket = io("localhost:3001");

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

const TRANSLATE_CHANNEL_RESPONSE = "translate-channel-response";

socket.on(TRANSLATE_CHANNEL_RESPONSE, (socketData) => {
  data.translates.push(socketData);
});

onMounted(async () => {
  const translatesResponse = await axios.get("http://localhost:3000/");

  data.translates = translatesResponse.data;
});
</script>
<style scoped></style>
