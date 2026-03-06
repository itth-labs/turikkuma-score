<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Prism, { type Grammar } from 'prismjs';
import { ScoreSet } from './main.ts';
import { ElMessage } from 'element-plus'

const hackmd_score_data = ref('');
const generated_result = ref('');
var generated_text = '';
const error_message = ref('');

const scores: ScoreSet = new ScoreSet();

const update_result = () => {
  scores.clear();
  error_message.value = "";
  generated_text = "";
  generated_result.value = "";

  var player = null;
  for (const line of hackmd_score_data.value.split("\n")) {
    if (line.match(/^\s*$/)) {
      continue;
    }
    {
      const m = line.match(/^###\s*(.+)$/);
      if (m !== null) {
        player = m[1];
        continue;
      }
    }
    {
      const m = line.match(/^(\d+)\.\s*(\d+)(?:[^\d].+)?$/);
      if (m === null) {
        error_message.value = "形式に誤りがあります";
        continue;
      }
      const round = parseInt(m[1] as string);
      const score = parseInt(m[2] as string);
      if (player === null) {
        error_message.value = "形式に誤りがあります";
        return;
      }
      if (score !== 0) {
        scores.set(player as string, round, score);
      }
    }
  }

  if (scores.is_empty()) {
    return;
  }
  generated_text = "### 総合スコア\n";
  for (const [player, sum] of scores.full_score()) {
    generated_text += `* ${player}: ${sum}\n`;
  }
  generated_text += "\n\n### 平均スコア\n";
  for (const [player, avg] of scores.average_score()) {
    generated_text += `* ${player}: ${avg}\n`;
  }
  generated_text += "\n\n### 最高スコア\n";
  for (const [player, max] of scores.max_score()) {
    generated_text += `* ${player}: ${max}\n`;
  }
  generated_result.value = Prism.highlight(generated_text, Prism.languages["markdown"] as Grammar, "markdown");
}

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
  <el-container style="min-height: 100vh;">
    <el-row style="width: 100%; height: inherit;">
      <el-col :lg="12" :md="12" :sm="12" :xs="24"
        style="height: inherit; padding: 10px">
        <el-row>
          <h2>Hackmd側のMarkdown</h2>
        </el-row>
        <el-row>
          <el-input v-model="hackmd_score_data" :rows=32 type="textarea" @input="update_result" />
        </el-row>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xs="24"
        style="height: inherit; padding: 10px">
        <el-row>
          <h2>集計結果</h2>
        </el-row>
        <el-row>
          <el-button @click="copyResult" type="primary" v-if="generated_result !== ''">Copy</el-button>
          <template v-else>
            <el-alert title="データを入力してください" type="warning" v-if="error_message === ''" />
          </template>
        </el-row>
        <el-scrollbar style="max-height: 640px;" v-if="error_message === ''">
          <pre id="generated" class="language-markup" v-html="generated_result" v-if="generated_result !== ''" />
        </el-scrollbar>
        <el-row v-else>
          <el-alert :title="error_message" type="error" />
        </el-row>
      </el-col>
    </el-row>
  </el-container>
</template>

<style scoped></style>
