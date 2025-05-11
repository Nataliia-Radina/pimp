<script setup>
import { ref, computed } from 'vue'
import { useWallet } from '../composables/useWallet'

const emit = defineEmits(['back', 'submit'])

const props = defineProps({
  prediction: {
    type: Boolean,
    required: true
  }
})

const { address } = useWallet()
const betAmount = ref(0)
const maxAmount = 100 // We can make this dynamic later

const shortAddress = computed(() => {
  if (!address.value) return ''
  return `0x${address.value.slice(2, 10)}...${address.value.slice(-4)}`
})

const handlePlaceBet = () => {
  if (betAmount.value > 0) {
    emit('submit', {
      amount: betAmount.value,
      prediction: props.prediction
    })
  }
}

const handleAllIn = () => {
  betAmount.value = maxAmount
}
</script>

<template>
  <div class="w-full max-w-md mx-auto bg-card border border-border rounded-lg p-6 space-y-6 animate-fade-in">
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <div class="text-sm text-foreground/70">Your wallet on Sapphire Testnet:</div>
        <span class="px-2 py-0.5 text-xs bg-accentPurple/20 text-accentPurple rounded-full">Testnet</span>
      </div>
      <div class="font-mono text-foreground">{{ shortAddress }}</div>
      <div class="text-sm text-foreground/70">
        You are placing a bet with test tokens. 
        <span class="text-accentPurple">This is not real money.</span>
      </div>
    </div>

    <div class="space-y-2">
      <div class="text-lg font-medium text-foreground">WILL PIMP GET ANY MONEY?</div>
      <div class="text-xl font-bold" :class="prediction ? 'text-accentGreen' : 'text-accentPurple'">
        {{ prediction ? 'YES' : 'NO' }}
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex justify-between text-sm text-foreground/70">
        <span>${{ betAmount }}</span>
        <span>MAX</span>
      </div>
      <input 
        type="range" 
        v-model="betAmount" 
        min="0" 
        :max="maxAmount"
        class="w-full appearance-none bg-border rounded-full h-1 focus:outline-none focus:ring-2 focus:ring-accentPurple/20"
      />
    </div>

    <div class="space-y-3">
      <button 
        @click="handlePlaceBet"
        class="w-full px-6 py-3 bg-card border border-border rounded-lg text-foreground hover:border-accentGreen transition-colors"
      >
        Place Bet
      </button>
      
      <button 
        @click="handleAllIn"
        class="w-full px-6 py-3 bg-card border border-accentPurple rounded-lg text-accentPurple hover:bg-accentPurple/10 transition-colors"
      >
        ALL IN
      </button>

      <button 
        @click="$emit('back')"
        class="w-full px-6 py-3 bg-card border border-border rounded-lg text-foreground/70 hover:text-foreground transition-colors"
      >
        GO BACK
      </button>
    </div>
  </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: theme('colors.accentPurple');
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: theme('colors.accentPurple');
  cursor: pointer;
  border: none;
}
</style>
