<script setup>
import { ref, computed } from 'vue'
import { useWallet } from './composables/useWallet'
import BettingForm from './components/BettingForm.vue'
import SuccessScreen from './components/SuccessScreen.vue'

const prediction = ref(null) // null = not voted, true = YES, false = NO
const totalPredictions = ref(0)
const currentScreen = ref('main') // 'main', 'betting', 'success'
const submittedBet = ref(null)

const { address, error, connect } = useWallet()

const shortAddress = computed(() => {
  if (!address.value) return ''
  return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
})

const getButtonText = computed(() => {
  if (!address.value) {
    return 'Connect Wallet to Submit'
  }
  return prediction.value === true ? 'Submit YES Prediction' : 'Submit NO Prediction'
})

const handleAction = async () => {
  if (!address.value) {
    await connect()
    return
  }
  currentScreen.value = 'betting'
}

const handleBack = () => {
  currentScreen.value = 'main'
  prediction.value = null
  submittedBet.value = null
}

const handleBetSubmit = (bet) => {
  submittedBet.value = bet
  // Increment total predictions
  totalPredictions.value++
  // Add slight delay for smoother transition
  setTimeout(() => {
    currentScreen.value = 'success'
  }, 100)
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="border-b border-border p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold text-accentPurple">PIMP</h1>
        <p class="text-sm text-foreground/70">
          {{ address ? `${shortAddress} · ` : '' }}Will this app win the hackathon?
        </p>
      </div>
    </header>

    <main class="container mx-auto p-4">
      <Transition name="fade" mode="out-in">
        <section v-if="currentScreen === 'main'" class="max-w-2xl mx-auto">
          <div class="text-center space-y-4">
            <h2 class="text-3xl font-bold">Privacy Prediction Market</h2>
            <p class="text-foreground/70">
              Place your prediction privately using ROFL encryption.
              Your prediction will be revealed after the event.
            </p>
          </div>

          <section class="mt-12 space-y-8">
            <div class="flex justify-center gap-4">
              <button
                @click="prediction = true"
                class="px-6 py-3 rounded-lg text-lg font-medium transition-all"
                :class="{
                  'bg-accentGreen text-background': prediction === true,
                  'bg-card border border-accentGreen text-accentGreen hover:bg-accentGreen/10': prediction !== true
                }"
              >
                YES
              </button>
              <button
                @click="prediction = false"
                class="px-6 py-3 rounded-lg text-lg font-medium transition-all"
                :class="{
                  'bg-accentPurple text-background': prediction === false,
                  'bg-card border border-accentPurple text-accentPurple hover:bg-accentPurple/10': prediction !== false
                }"
              >
                NO
              </button>
            </div>

            <div class="mt-8 flex justify-center" v-if="prediction !== null">
              <button 
                @click="handleAction"
                class="px-6 py-3 rounded-lg text-lg font-medium transition-all"
                :class="{
                  'bg-accentGreen text-background hover:bg-accentGreen/90': address && prediction === true,
                  'bg-accentPurple text-background hover:bg-accentPurple/90': address && prediction === false,
                  'bg-card border border-accentGreen text-accentGreen hover:bg-accentGreen/10': !address && prediction === true,
                  'bg-card border border-accentPurple text-accentPurple hover:bg-accentPurple/10': !address && prediction === false
                }"
              >
                {{ getButtonText }}
              </button>
            </div>
          </section>

          <section class="mt-12 text-center space-y-4">
            <div class="text-2xl font-bold">
              {{ totalPredictions }}
            </div>
            <div class="text-foreground/70">
              Total Predictions Made
            </div>
          </section>
        </section>

        <BettingForm 
          v-else-if="currentScreen === 'betting'"
          :prediction="prediction" 
          @back="handleBack"
          @submit="handleBetSubmit"
        />

        <SuccessScreen
          v-else
          :prediction="prediction"
          :amount="submittedBet?.amount"
          :totalBets="totalPredictions"
          :yesPercentage="25"
          @back="handleBack"
        />
      </Transition>
    </main>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
