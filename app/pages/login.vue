<template>
  <div class="min-h-screen flex flex-col font-body-md bg-surface dark:bg-neutral-950 text-on-surface dark:text-neutral-100 overflow-x-hidden relative transition-colors">
    <!-- Subtle Background Texture -->
    <div class="fixed inset-0 bg-noise z-0"></div>

    <main class="flex-grow flex items-center justify-center px-4 py-8 relative z-10">
      <!-- Centralized Login Card -->
      <div class="w-full max-w-[420px] bg-white dark:bg-neutral-900 ghost-border p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
        <!-- Branding/Header -->
        <div class="mb-6 text-center">
          <h1 class="font-headline-lg text-xl font-bold uppercase tracking-[0.22em] text-primary dark:text-white leading-none mb-2">
            THE WAY COLLECTIVE
          </h1>
          <p class="font-detail-mono text-xs text-on-surface-variant dark:text-neutral-400 uppercase mt-2">
            {{ step === 'credentials' ? 'PRECISÃO INDUSTRIAL / ENTRAR' : (step === '2fa_verify' ? 'SEGURANÇA / VERIFICAÇÃO EM 2 ETAPAS' : 'SEGURANÇA / CONFIGURAÇÃO 2FA') }}
          </p>
        </div>

        <!-- ETAPA 1: Credenciais Básicas -->
        <div v-if="step === 'credentials'" class="flex flex-col gap-4">
          <AppInput
            v-model="form.email"
            label="E-MAIL"
            placeholder="USUARIO@DOMINIO.COM"
            type="email"
            required
          />

          <AppInput
            v-model="form.password"
            label="SENHA"
            placeholder="********"
            type="password"
            required
            @keyup.enter="handleLogin"
          />

          <div class="pt-1">
            <AppButton
              type="button"
              variant="primary"
              class="!py-3 h-11"
              :loading="loading"
              @click="handleLogin"
            >
              ENTRAR
            </AppButton>
          </div>

          <div class="text-center pt-2 border-t border-black/10 dark:border-white/10 mt-1">
            <NuxtLink 
              to="/cadastro" 
              class="font-detail-mono text-xs text-on-surface-variant dark:text-neutral-400 hover:text-primary dark:hover:text-white transition-colors border-b border-transparent hover:border-primary dark:hover:border-white pb-0.5"
            >
              NÃO TEM UMA CONTA? CADASTRE-SE
            </NuxtLink>
          </div>
        </div>

        <!-- ETAPA 2: Verificação do Código 2FA Existente -->
        <div v-else-if="step === '2fa_verify'" class="flex flex-col gap-4">
          <div class="p-3.5 bg-surface-variant/40 dark:bg-neutral-800/60 border border-black/10 dark:border-white/15">
            <div class="flex items-center gap-2.5 mb-1.5">
              <span class="material-symbols-outlined text-primary dark:text-white text-lg">lock</span>
              <span class="font-label-caps text-xs uppercase tracking-wider font-bold">GOOGLE AUTHENTICATOR</span>
            </div>
            <p class="font-detail-mono text-[11px] text-on-surface-variant dark:text-neutral-400 uppercase leading-relaxed">
              Abra o aplicativo Google Authenticator em seu celular e digite o código de 6 dígitos gerado para sua conta.
            </p>
          </div>

          <AppInput
            v-model="twoFactorCode"
            label="CÓDIGO DE SEGURANÇA DE 6 DÍGITOS"
            placeholder="000000"
            type="text"
            maxlength="6"
            required
            @keyup.enter="handleVerify2FA"
          />

          <div class="pt-1 flex flex-col gap-2.5">
            <AppButton
              type="button"
              variant="primary"
              class="!py-3 h-11"
              :loading="loading"
              @click="handleVerify2FA"
            >
              VERIFICAR E ACESSAR
            </AppButton>

            <button
              type="button"
              class="w-full h-10 border border-black dark:border-white/40 font-detail-mono uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-colors bg-white dark:bg-neutral-800 dark:text-white text-xs"
              @click="backToCredentials"
            >
              VOLTAR PARA CREDENCIAIS
            </button>
          </div>
        </div>

        <!-- ETAPA 3: Setup Inicial Obrigatório do 2FA -->
        <div v-else-if="step === '2fa_setup'" class="flex flex-col gap-4">
          <div class="p-3.5 bg-surface-variant/40 dark:bg-neutral-800/60 border border-black/10 dark:border-white/15 text-center">
            <span class="font-label-caps text-xs uppercase tracking-wider font-bold block mb-1">
              CONFIGURE O GOOGLE AUTHENTICATOR
            </span>
            <p class="font-detail-mono text-[11px] text-on-surface-variant dark:text-neutral-400 uppercase mb-3">
              Escaneie o código QR abaixo com a câmera do seu aplicativo ou insira a chave manual:
            </p>

            <!-- QR Code Renderizado -->
            <div class="inline-block p-2 bg-white border border-black dark:border-white/40 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-2.5">
              <img 
                v-if="twoFactorSetupData.qr_code" 
                :src="twoFactorSetupData.qr_code" 
                alt="QR Code Google Authenticator" 
                class="w-40 h-40 mx-auto"
              />
            </div>

            <!-- Chave Manual -->
            <div class="bg-surface dark:bg-neutral-900 p-2 border border-black/10 dark:border-white/15 select-all">
              <span class="font-detail-mono text-[10px] text-on-surface-variant dark:text-neutral-400 block uppercase">CHAVE MANUAL:</span>
              <code class="font-detail-mono text-xs font-bold tracking-widest text-primary dark:text-white">{{ twoFactorSetupData.secret }}</code>
            </div>
          </div>

          <AppInput
            v-model="twoFactorCode"
            label="DIGITE O CÓDIGO DE 6 DÍGITOS GERADO"
            placeholder="000000"
            type="text"
            maxlength="6"
            required
            @keyup.enter="handleConfirmSetup2FA"
          />

          <div class="pt-1 flex flex-col gap-2.5">
            <AppButton
              type="button"
              variant="primary"
              class="!py-3 h-11"
              :loading="loading"
              @click="handleConfirmSetup2FA"
            >
              CONFIRMAR E ATIVAR 2FA
            </AppButton>

            <button
              type="button"
              class="w-full h-10 border border-black dark:border-white/40 font-detail-mono uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-colors bg-white dark:bg-neutral-800 dark:text-white text-xs"
              @click="backToCredentials"
            >
              CANCELAR
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Identity Anchor -->
    <AppFooter variant="simple" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { setAuthToken, setClientId, setClientName, useApi } from '~/composables/api'

definePageMeta({
  layout: false
})

const router = useRouter()
const route = useRoute()
const toast = useToast()
const loading = ref(false)

const step = ref<'credentials' | '2fa_verify' | '2fa_setup'>('credentials')
const twoFactorCode = ref('')
const tempToken = ref('')
const twoFactorSetupData = ref({
  secret: '',
  qr_code: '',
  otpauth_url: ''
})

onMounted(() => {
  if (route.query.reason === 'no-auth') {
    toast.add({
      severity: 'error',
      summary: 'ACESSO NEGADO',
      detail: 'Você precisa estar logado para acessar esta página.',
      life: 4000
    })
  }
})

const form = ref({
  email: '',
  password: ''
})

const backToCredentials = () => {
  step.value = 'credentials'
  twoFactorCode.value = ''
  tempToken.value = ''
}

const finalizeLoginSuccess = async (response: any) => {
  const token = response?.data?.token || response?.token
  if (token) {
    await setAuthToken(token)
  } else {
    throw new Error('Token de autenticação não retornado pela API.')
  }

  const id = response?.data?.id || response?.id
  if (id !== undefined && id !== null) {
    await setClientId(String(id))
  } else {
    throw new Error('ID do cliente não retornado pela API.')
  }

  const name = response?.data?.nome || response?.nome
  if (name) {
    await setClientName(name)
  } else {
    throw new Error('Nome do cliente não retornado pela API.')
  }

  toast.add({
    severity: 'success',
    summary: 'LOGIN REALIZADO',
    detail: `Bem-vindo(a), ${name}!`,
    life: 3000
  })

  try {
    await useApi<any>('/profissional/disponibilidade', 'GET')
  } catch (errColeta) {
    console.warn('Pré-coleta de profissionais e serviços:', errColeta)
  }

  router.push('/agendamentos')
}

const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    toast.add({
      severity: 'warn',
      summary: 'CAMPOS OBRIGATÓRIOS',
      detail: 'Informe seu e-mail e senha.',
      life: 3000
    })
    return
  }

  loading.value = true

  try {
    const response = await useApi<any>('/login/cliente', 'POST', {}, {
      email: form.value.email,
      senha: form.value.password,
    })

    const data = response?.data || response

    // Caso 1: Usuário precisa configurar o 2FA (novo usuário ou chave não registrada)
    if (data?.require_2fa_setup) {
      step.value = '2fa_setup'
      tempToken.value = data.temp_token
      twoFactorSetupData.value = {
        secret: data.secret,
        qr_code: data.qr_code,
        otpauth_url: data.otpauth_url
      }
      twoFactorCode.value = ''
      toast.add({
        severity: 'info',
        summary: 'CONFIGURAÇÃO DE 2FA',
        detail: 'Por favor, configure o Google Authenticator para continuar.',
        life: 5000
      })
      return
    }

    // Caso 2: Usuário já possui 2FA ativo e precisa informar os 6 dígitos
    if (data?.require_2fa) {
      step.value = '2fa_verify'
      tempToken.value = data.temp_token
      twoFactorCode.value = ''
      return
    }

    // Caso 3: Login concluído diretamente (se 2FA estiver desligado pelo usuário)
    await finalizeLoginSuccess(response)

  } catch (error: any) {
    console.error('Erro de autenticação:', error)
    const errorMsg = error?.data?.error?.message || error?.response?._data?.error?.message || error?.message || 'Verifique suas credenciais e tente novamente.'

    toast.add({
      severity: 'error',
      summary: 'FALHA NA AUTENTICAÇÃO',
      detail: errorMsg,
      life: 4000
    })
  } finally {
    loading.value = false
  }
}

// Validação dos 6 dígitos do Google Authenticator para login regular
const handleVerify2FA = async () => {
  const cleanCode = twoFactorCode.value.trim().replace(/\D/g, '')
  if (cleanCode.length !== 6) {
    toast.add({
      severity: 'warn',
      summary: 'CÓDIGO INCOMPLETO',
      detail: 'O código do autenticador deve possuir 6 dígitos.',
      life: 3000
    })
    return
  }

  loading.value = true

  try {
    const response = await useApi<any>('/login/2fa/verify', 'POST', {}, {
      temp_token: tempToken.value,
      code: cleanCode
    })

    await finalizeLoginSuccess(response)

  } catch (error: any) {
    console.error('Erro na validação do 2FA:', error)
    const errorMsg = error?.data?.error?.message || error?.response?._data?.error?.message || error?.message || 'Código de autenticação inválido ou expirado.'

    toast.add({
      severity: 'error',
      summary: 'CÓDIGO INVÁLIDO',
      detail: errorMsg,
      life: 4000
    })
  } finally {
    loading.value = false
  }
}

// Confirmação do primeiro setup do Google Authenticator
const handleConfirmSetup2FA = async () => {
  const cleanCode = twoFactorCode.value.trim().replace(/\D/g, '')
  if (cleanCode.length !== 6) {
    toast.add({
      severity: 'warn',
      summary: 'CÓDIGO INCOMPLETO',
      detail: 'Digite o código de 6 dígitos gerado pelo seu app Google Authenticator.',
      life: 3000
    })
    return
  }

  loading.value = true

  try {
    const response = await useApi<any>('/login/2fa/setup', 'POST', {}, {
      temp_token: tempToken.value,
      secret: twoFactorSetupData.value.secret,
      code: cleanCode
    })

    toast.add({
      severity: 'success',
      summary: '2FA CONFIGURADO',
      detail: 'Google Authenticator ativado com sucesso!',
      life: 3000
    })

    await finalizeLoginSuccess(response)

  } catch (error: any) {
    console.error('Erro na configuração do 2FA:', error)
    const errorMsg = error?.data?.error?.message || error?.response?._data?.error?.message || error?.message || 'Código de autenticação inválido. Verifique o aplicativo.'

    toast.add({
      severity: 'error',
      summary: 'FALHA NA CONFIGURAÇÃO',
      detail: errorMsg,
      life: 4000
    })
  } finally {
    loading.value = false
  }
}
</script>
