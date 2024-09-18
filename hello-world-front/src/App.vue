<template>
  <div>
    Hello world distribuido

    <div>
      <textarea v-model="text" />
    </div>
    <button>Traduzir</button>

    <div>
      <ul>
        <li v-for="(val, key) in data.translates" :key="key">
          <b>Texto original: {{val.orinalText}}</b>
          |
          <b>Texto traduzido: {{val.translatedText}}</b>
        </li>

      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import axios from "axios";

const text = ref("");

const data = reactive({
  translates: [],
});

onMounted(async () => {
  const translatesResponse = await axios.get("http://localhost:3000/");

  data.translates = translatesResponse.data;
});
</script>
<style scoped></style>
