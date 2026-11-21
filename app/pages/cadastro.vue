<template>
  <div class="min-h-screen flex flex-col font-body-md bg-surface dark:bg-neutral-950 text-on-surface dark:text-neutral-100 overflow-x-hidden relative transition-colors">
    <!-- Subtle Background Texture -->
    <div class="fixed inset-0 bg-noise z-0"></div>

    <main class="flex-grow flex items-center justify-center px-4 md:px-6 py-16 relative z-10">
      <!-- Centralized Sign Up Card -->
      <div class="w-full max-w-[480px] bg-white dark:bg-neutral-900 ghost-border p-8 md:p-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
        <!-- Branding/Header -->
        <div class="mb-12 text-center">
          <h1 class="font-headline-lg text-headline-lg uppercase tracking-tighter text-primary dark:text-white mb-2">
            THE WAY COLLECTIVE
          </h1>
          <p class="font-detail-mono text-detail-mono text-on-surface-variant dark:text-neutral-400">
            PRECISÃO INDUSTRIAL / CRIAR CONTA
          </p>
        </div>

        <!-- Registration Form -->
        <div class="space-y-6">
          <!-- Full Name -->
          <AppInput
            v-model="form.fullName"
            label="NOME COMPLETO"
            placeholder="NOME E SOBRENOME"
            type="text"
            required
          />

          <!-- Email Address -->
          <AppInput
            v-model="form.email"
            label="E-MAIL"
            placeholder="USUARIO@DOMINIO.COM"
            type="email"
            required
          />

          <!-- CPF -->
          <AppInput
            v-model="form.cpf"
            label="CPF"
            placeholder="000.000.000-00"
            type="text"
            required
          />

          <!-- Phone Number -->
          <AppInput
            v-model="form.phone"
            label="TELEFONE"
            placeholder="(11) 99999-9999"
            type="tel"
            required
          />

          <!-- Birth Date -->
          <AppInput
            v-model="form.birthDate"
            label="DATA DE NASCIMENTO"
            placeholder="AAAA-MM-DD"
            type="date"
            required
          />

          <!-- Password Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppInput
              v-model="form.password"
              label="SENHA"
              placeholder="********"
              type="password"
              required
            />
            <AppInput
              v-model="form.confirmPassword"
              label="CONFIRMAR SENHA"
              placeholder="********"
              type="password"
              required
            />
          </div>

          <!-- Action -->
          <div class="pt-6">
            <AppButton
              type="button"
              variant="primary"
              :loading="loading"
              @click="handleRegister"
            >
              CRIAR CONTA
            </AppButton>
          </div>

          <!-- Redirect -->
          <div class="text-center pt-4">
            <NuxtLink 
              to="/login" 
              class="font-detail-mono text-detail-mono text-on-surface-variant dark:text-neutral-400 hover:text-primary dark:hover:text-white transition-colors border-b border-transparent hover:border-primary dark:hover:border-white pb-0.5"
            >
              JÁ TEM UMA CONTA? ENTRAR
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Identity Anchor -->
    <AppFooter variant="simple" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { setAuthToken, setClientId, setClientName, useApi } from '~/composables/api'

definePageMeta({
  layout: false
})

const router = useRouter()
const toast = useToast()
const loading = ref(false)

const form = ref({
  fullName: '',
  email: '',
  cpf: '',
  phone: '',
  birthDate: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = async () => {
  if (!form.value.fullName || !form.value.email || !form.value.cpf || !form.value.phone || !form.value.birthDate || !form.value.password) {
    toast.add({
      severity: 'warn',
      summary: 'DADOS INCOMPLETOS',
      detail: 'Por favor, preencha todos os campos obrigatórios.',
      life: 4000
    })
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    toast.add({
      severity: 'error',
      summary: 'SENHAS DIVERGENTES',
      detail: 'As senhas informadas não coincidem.',
      life: 4000
    })
    return
  }

  const cleanCpf = form.value.cpf.replace(/\D/g, '')
  if (cleanCpf.length !== 11) {
    toast.add({
      severity: 'error',
      summary: 'CPF INVÁLIDO',
      detail: 'O CPF precisa ter exatamente 11 dígitos numéricos.',
      life: 4000
    })
    return
  }

  loading.value = true

  try {
    // 1. Cadastra o cliente na API (criado com two_factor_enabled = false por padrão)
    const birthDateIso = new Date(`${form.value.birthDate}T00:00:00Z`).toISOString()

    const clientPayload = {
      nome: form.value.fullName.trim(),
      email: form.value.email.trim(),
      cpf: cleanCpf,
      telefone: form.value.phone.replace(/\D/g, ''),
      senha: form.value.password,
      data_nascimento: birthDateIso
    }

    await useApi<any>('/cliente', 'POST', {}, clientPayload)

    // 2. Realiza o login inicial direto
    const loginResponse = await useApi<any>('/login/cliente', 'POST', {}, {
      email: clientPayload.email,
      senha: clientPayload.senha
    })

    const data = loginResponse?.data || loginResponse

    // Salva autenticação
    const token = data?.token
    const id = data?.id
    const name = data?.nome || form.value.fullName

    if (token) await setAuthToken(token)
    if (id !== undefined && id !== null) await setClientId(String(id))
    if (name) await setClientName(name)

    toast.add({
      severity: 'success',
      summary: 'CONTA CRIADA COM SUCESSO',
      detail: `Bem-vindo(a), ${name}!`,
      life: 3000
    })

    router.push('/agendamentos')

  } catch (error: any) {
    console.error('Erro ao cadastrar:', error)
    const errorMsg = error?.data?.error?.message || error?.response?._data?.error?.message || error?.message || 'Erro ao realizar cadastro. Tente novamente.'
    
    toast.add({
      severity: 'error',
      summary: 'ERRO NO CADASTRO',
      detail: errorMsg,
      life: 4000
    })

  } finally {
    loading.value = false
  }
}
</script>
