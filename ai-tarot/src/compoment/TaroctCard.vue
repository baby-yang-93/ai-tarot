<template>
  <div class="scene">
    <div class="card" :class="{ 'is-flipped': isFlipped }" @click="handleFlip">
      <div class="card-face card-back">
        <img src="/path-to-your-card-back.jpg" alt="背面" />
      </div>
      <div class="card-face card-front">
        <img :src="cardImage" alt="正面" />
        <h3>{{ cardName }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
// 在你的 script setup 中
import { ref, watch } from 'vue'

const fullText = ref('') // 存储 AI 返回的完整文案
const displayedText = ref('') // 绑定在页面上显示的文案
const isTyping = ref(false)

// 打字机函数
const typeWriter = (text) => {
  if (!text) return
  isTyping.value = true
  displayedText.value = ''
  let i = 0
  const speed = 50 // 打字速度 (毫秒)

  const timer = setInterval(() => {
    displayedText.value += text.charAt(i)
    i++
    if (i >= text.length) {
      clearInterval(timer)
      isTyping.value = false
    }
  }, speed)
}

// 监听 AI 接口返回的数据，一旦拿到结果就开始打字
// 假设你把 API 结果存到了 aiResult 里
watch(aiResult, (newVal) => {
  if (newVal) {
    fullText.value = newVal
    typeWriter(newVal)
  }
})
</script>

<style scoped>
.scene {
  width: 200px;
  height: 350px;
  perspective: 600px; /* 3D 透视的关键 */
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 1s; /* 翻转动画持续时间 */
  transform-style: preserve-3d;
  cursor: pointer;
}

.card.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* 关键：背面不可见 */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
}

.card-front {
  transform: rotateY(180deg); /* 正面一开始是转过去的 */
}
</style>