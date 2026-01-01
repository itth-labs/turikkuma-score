<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import HelloWorld from './components/HelloWorld.vue';
import Prism from 'prismjs';
import { ScoreSet } from './main.ts';
import type prismjsPlugin from 'vite-plugin-prismjs';
import { ElMessage } from 'element-plus'

const hackmd_score_data = ref('');
const generated_result = ref('');
var generated_text = '';

const scores: ScoreSet = new ScoreSet();

const copyResult = () => {
  navigator.clipboard.writeText(generated_text);
  ElMessage({
    message: "Copied!",
    type: "success"
  });
};

onMounted(() => {
  Prism.manual = true;
});
</script>

<template>
  <el-container style="min-height: 100vh">
    <el-row style="width: 100%; height: inherit;">
      <el-col :lg="12" :md="12" :sm="12" :xs="24"
        style="background-color: var(--el-color-primary-light-9); height: inherit; padding: 10px">
        <el-row>
          <h2>Hackmd側のMarkdown</h2>
        </el-row>
        <el-input v-model="hackmd_score_data" :rows=32 type="textarea" />
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24"
        style="background-color: var(--el-color-primary-light-9); height: inherit; padding: 10px">
        <el-row>
          <h2>集計結果</h2>
        </el-row>
        <el-button @click="copyResult" type="primary">Copy</el-button>
        <el-scrollbar style="max-height: 700px;">
          <pre id="generated" class="language-markup" v-html="generated_result" />
        </el-scrollbar>
      </el-col>
    </el-row>
  </el-container>
</template>

<style scoped></style>
