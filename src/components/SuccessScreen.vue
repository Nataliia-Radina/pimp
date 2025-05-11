<script setup>
import { computed } from 'vue'
import { ref, onMounted } from 'vue'

const props = defineProps({
  prediction: {
    type: Boolean,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  totalBets: {
    type: Number,
    default: 100
  },
  totalAmount: {
    type: Number,
    default: 694.20
  },
  yesPercentage: {
    type: Number,
    default: 25
  }
})

const noPercentage = computed(() => 100 - props.yesPercentage)
const formattedAmount = computed(() => props.amount.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD'
}))
const formattedTotalAmount = computed(() => props.totalAmount.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD'
}))

// Mock transaction hash - in real app this would come from the contract interaction
const txHash = '0x7f9c8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b'
const confirmations = ref(1)

onMounted(() => {
  // Simulate increasing confirmations
  const interval = setInterval(() => {
    if (confirmations.value < 12) {
      confirmations.value++
    } else {
      clearInterval(interval)
    }
  }, 2000)
})
</script>

<template>
  <div class="w-full max-w-md mx-auto bg-card border border-border rounded-lg p-6 space-y-6 animate-fade-in">
    <!-- Success Icon -->
    <div class="flex justify-center">
      <div class="w-16 h-16 rounded-full bg-accentGreen/10 flex items-center justify-center animate-bounce-once">
        <svg class="w-8 h-8 text-accentGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>

    <!-- Main Content -->
    <div class="text-center space-y-2">
      <h2 class="text-2xl font-semibold text-foreground">Transaction Confirmed!</h2>
      <p class="text-foreground/70">Your prediction has been securely recorded on-chain</p>
    </div>

    <!-- Bet Details -->
    <div class="bg-background/50 rounded-lg p-4 space-y-3 border border-border/50">
      <div class="flex justify-between items-center">
        <span class="text-foreground/70">Amount</span>
        <span class="text-lg font-medium">{{ formattedAmount }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-foreground/70">Position</span>
        <span 
          class="px-3 py-1 rounded-md text-sm font-medium"
          :class="prediction ? 'bg-accentGreen/10 text-accentGreen' : 'bg-accentPurple/10 text-accentPurple'"
        >
          {{ prediction ? 'YES' : 'NO' }}
        </span>
      </div>
    </div>

    <!-- Market Stats -->
    <div class="space-y-3">
      <div class="flex justify-between items-center text-sm">
        <div class="space-y-1">
          <div class="text-foreground/70">Total Participants</div>
          <div class="font-medium">{{ totalBets.toLocaleString() }}</div>
        </div>
        <div class="text-right space-y-1">
          <div class="text-foreground/70">Total Volume</div>
          <div class="font-medium">{{ formattedTotalAmount }}</div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="space-y-2">
        <div class="relative h-3 bg-background rounded-full overflow-hidden border border-border/50">
          <div 
            class="absolute top-0 left-0 h-full bg-gradient-to-r from-accentGreen to-accentGreen/80 transition-all duration-500"
            :style="{ width: `${yesPercentage}%` }"
          ></div>
        </div>
        <div class="flex justify-between text-xs font-medium">
          <span class="text-accentGreen">Yes {{ yesPercentage }}%</span>
          <span class="text-accentPurple">No {{ noPercentage }}%</span>
        </div>
      </div>
    </div>

    <!-- Transaction Details -->
    <div class="bg-background/30 rounded-lg p-3 space-y-2">
      <div class="flex items-center justify-between text-xs">
        <span class="text-foreground/70">Transaction Hash</span>
        <a 
          :href="`https://explorer.sapphire.oasis.dev/tx/${txHash}`"
          target="_blank"
          class="text-accentGreen hover:underline font-mono truncate ml-2 max-w-[200px]"
        >
          {{ txHash }}
        </a>
      </div>
      <div class="flex items-center justify-between text-xs">
        <span class="text-foreground/70">Confirmations</span>
        <span class="font-medium">{{ confirmations }}/12</span>
      </div>
    </div>

    <button 
      @click="$emit('back')"
      class="w-full px-6 py-3 bg-background/50 border border-border rounded-lg text-foreground hover:bg-background/70 transition-colors font-medium"
    >
      Return to Predictions
    </button>
  </div>
</template>
