<template>
  <div class="font-body-md bg-surface dark:bg-neutral-950 text-on-surface dark:text-neutral-100 min-h-screen flex flex-col relative transition-colors">
    <!-- Page Loader -->
    <div v-if="pageLoading" class="fixed inset-0 bg-surface dark:bg-neutral-950 z-50 flex flex-col items-center justify-center gap-4">
      <div class="fixed inset-0 bg-noise z-0 pointer-events-none"></div>
      <div class="relative z-10 border border-black dark:border-white/30 p-8 bg-white dark:bg-neutral-900 flex flex-col items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
        <span class="material-symbols-outlined animate-spin text-4xl text-primary dark:text-white">progress_activity</span>
        <span class="font-detail-mono text-detail-mono uppercase tracking-widest font-bold text-primary dark:text-white">CARREGANDO DADOS...</span>
      </div>
    </div>

    <div v-else class="flex flex-col flex-grow w-full relative">
      <!-- Subtle Background Texture -->
      <div class="fixed inset-0 bg-noise z-0"></div>

      <!-- Sidebar navigation -->
      <AppSidebar 
        :is-open="sidebarOpen" 
        @close="sidebarOpen = false" 
      />

    <!-- Main Content Area -->
    <div class="md:ml-64 min-h-screen flex flex-col relative z-10">
      
      <!-- Header component -->
      <AppHeader 
        breadcrumb="PERFIL" 
        show-menu-button 
        :user-id="userId" 
        @toggle-sidebar="sidebarOpen = true"
      />

      <!-- Canvas Area / Profile Form -->
      <div class="flex-1 p-6 md:p-12 max-w-4xl mx-auto w-full">
        <form class="space-y-6 md:space-y-8" @submit.prevent="handleSave">
          
          <!-- Profile Picture Section -->
           <!-- <section class="ghost-border p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 bg-white">
            <div class="relative group">
              <div class="w-32 h-32 md:w-40 md:h-40 bg-surface-variant border border-black/10 overflow-hidden">
                <img 
                  class="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMy2JOyomx3rOSDhQ7xVAT6K9adwrN3uMkNpGu1vlBF45fijmQss34LMHlt0_37jUaDvYqQvWLIoWvGkVV1Dp1ce4NQ-2mNt6a4QUuzN6Aj5irWEw_88Zr8QBFZeucQd_3DbyFkG_DVSbre963QxkQPXsIjJm3bHhsB-h9ACsJNEmDSQVWT-A7-xMQuoHgfskasySgFyt896tJGqDSWViCbN_MIMlfBRUrKaBPqxDGzqp0sw_IebQrzQ" 
                  alt="Avatar"
                />
              </div>
            </div>
            
            <div class="flex flex-col items-center md:items-start gap-3">
              <h3 class="font-label-caps text-label-caps uppercase">Foto de Perfil</h3>
              <p class="font-detail-mono text-[12px] opacity-60 max-w-xs text-center md:text-left">
                Envie um retrato em alta resolução. Formato quadrado recomendado. Tamanho máximo: 5MB.
              </p>
              <button 
                class="mt-2 px-6 py-2 border border-black font-detail-mono text-detail-mono uppercase hover:bg-black hover:text-white transition-all active:scale-95 bg-white" 
                type="button"
                @click="changePhoto"
              >
                ALTERAR FOTO
              </button>
            </div>
          </section> -->

          <hr class="border-black/5 dark:border-white/10" />

          <!-- Personal Information Section -->
          <section class="space-y-6">
            <div class="flex items-center gap-2 mb-4">
              <span class="w-2 h-2 bg-black dark:bg-white"></span>
              <h2 class="font-label-caps text-label-caps uppercase tracking-widest">Informações Pessoais</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AppInput
                v-model="profile.fullName"
                label="Nome Completo"
                placeholder="ERIK VANDER"
                type="text"
                required
              />
              <AppInput
                v-model="profile.email"
                label="E-mail"
                placeholder="vander@waycollective.com"
                type="email"
                :disabled="true"
                required
              />
              <AppInput
                v-model="profile.phone"
                label="Telefone"
                placeholder="(11) 99999-9999"
                type="tel"
                required
              />

              <AppInput
                v-model="profile.documentNumber"
                label="CPF"
                placeholder="000.000.000-00"
                type="text"
                required
              />

              <AppInput
                v-model="profile.birthDate"
                label="Data de Nascimento"
                type="date"
                required
                :disabled="true"
              />
            </div>
          </section>

          <hr class="border-black/5 dark:border-white/10" />

          <!-- Account Security Section -->
          <section class="space-y-6">
            <div class="flex items-center gap-2 mb-4">
              <span class="w-2 h-2 bg-black dark:bg-white"></span>
              <h2 class="font-label-caps text-label-caps uppercase tracking-widest">Segurança da Conta</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AppInput
                v-model="security.currentPassword"
                label="Senha Atual"
                placeholder="••••••••••••"
                type="password"
              />
              <AppInput
                v-model="security.newPassword"
                label="Nova Senha"
                placeholder="••••••••••••"
                type="password"
              />
            </div>
            
            <p class="font-detail-mono text-[10px] opacity-40 uppercase">
              A senha deve ter pelo menos 12 caracteres e incluir complexidade técnica.
            </p>
          </section>

          <hr class="border-black/5 dark:border-white/10" />

          <!-- Two-Factor Authentication Section -->
          <section class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-black dark:bg-white"></span>
                <h2 class="font-label-caps text-label-caps uppercase tracking-widest">Autenticação em Dois Fatores (2FA)</h2>
              </div>
              
              <!-- Badge Status -->
              <div class="flex items-center gap-2">
                <span 
                  class="inline-flex items-center gap-1.5 px-3 py-1 font-detail-mono text-[11px] uppercase tracking-wider border font-bold"
                  :class="twoFactorEnabled ? 'bg-black text-white border-black dark:bg-white dark:text-neutral-950 dark:border-white' : 'bg-surface-variant text-on-surface-variant border-black/20 dark:bg-neutral-800 dark:text-neutral-400 dark:border-white/15'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="twoFactorEnabled ? 'bg-green-400' : 'bg-neutral-400'"></span>
                  {{ twoFactorEnabled ? 'ATIVO' : 'DESATIVADO' }}
                </span>
              </div>
            </div>

            <div class="p-6 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
              <div class="space-y-1 max-w-xl">
                <h3 class="font-label-caps text-xs uppercase tracking-wider font-bold">Google Authenticator (TOTP)</h3>
                <p class="font-detail-mono text-xs opacity-70 uppercase">
                  Exige um código temporário de 6 dígitos gerado no celular ao fazer login. Você pode ligar ou desligar este recurso a qualquer momento.
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <button 
                  v-if="twoFactorEnabled"
                  type="button"
                  class="px-5 py-2.5 border border-error dark:border-red-500/60 text-error dark:text-red-400 font-detail-mono text-xs uppercase hover:bg-error hover:text-white dark:hover:bg-red-600 transition-colors active:scale-95 bg-white dark:bg-neutral-900"
                  @click="toggle2FA(false)"
                >
                  DESATIVAR 2FA
                </button>

                <button 
                  v-if="twoFactorEnabled"
                  type="button"
                  class="px-5 py-2.5 border border-black dark:border-white/40 font-detail-mono text-xs uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-colors active:scale-95 bg-white dark:bg-neutral-800 dark:text-white"
                  @click="openSetupModal"
                >
                  RECONFIGURAR APP
                </button>

                <button 
                  v-else
                  type="button"
                  class="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-neutral-950 font-detail-mono text-xs uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors active:scale-95"
                  @click="openSetupModal"
                >
                  ATIVAR 2FA
                </button>
              </div>
            </div>
          </section>

          <!-- Action Buttons -->
          <div class="pt-8 flex flex-col sm:flex-row items-center gap-4 border-t border-black/10 dark:border-white/10">
            <button 
              class="w-full sm:w-auto px-12 py-4 bg-primary dark:bg-white text-on-primary dark:text-neutral-950 font-label-caps text-label-caps uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors active:scale-95 disabled:opacity-50"
              type="submit"
              :disabled="saving"
            >
              <span v-if="!saving">SALVAR ALTERAÇÕES</span>
              <span v-else>SALVANDO...</span>
            </button>
            
            <div class="flex-1 md:flex justify-end hidden">
              <button 
                class="text-error dark:text-red-400 font-detail-mono text-detail-mono uppercase opacity-60 hover:opacity-100 transition-opacity" 
                type="button"
                @click="deactivateAccount"
              >
                DESATIVAR CONTA
              </button>
            </div>
          </div>

        </form>
      </div>

      <!-- Footer component -->
      <AppFooter variant="full" />
    </div>
    </div>

    <!-- Modal de Configuração de 2FA -->
    <div v-if="showSetup2FAModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="relative max-w-md w-full bg-white dark:bg-neutral-900 border border-black dark:border-white/30 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.18)] flex flex-col gap-6">
        <div class="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-4">
          <span class="material-symbols-outlined text-primary dark:text-white text-2xl">security</span>
          <div>
            <h3 class="font-label-caps text-base uppercase tracking-wider font-bold">GOOGLE AUTHENTICATOR</h3>
            <p class="font-detail-mono text-[10px] text-on-surface-variant dark:text-neutral-400 uppercase">
              Configure o aplicativo em seu celular
            </p>
          </div>
        </div>

        <div class="space-y-4 text-center">
          <div v-if="loadingSetupData" class="py-8 flex flex-col items-center gap-3">
            <span class="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
            <span class="font-detail-mono text-xs uppercase">Gerando chave de segurança...</span>
          </div>

          <template v-else>
            <p class="font-detail-mono text-xs uppercase opacity-80">
              Escaneie o QR Code abaixo no app Google Authenticator:
            </p>

            <div class="inline-block p-2 bg-white border border-black dark:border-white/40 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <img 
                v-if="modalSetupData.qr_code" 
                :src="modalSetupData.qr_code" 
                alt="QR Code Google Authenticator" 
                class="w-44 h-44 mx-auto"
              />
            </div>

            <div class="bg-surface dark:bg-neutral-800 p-2 border border-black/10 dark:border-white/15 select-all">
              <span class="font-detail-mono text-[10px] text-on-surface-variant dark:text-neutral-400 block uppercase">CHAVE MANUAL:</span>
              <code class="font-detail-mono text-xs font-bold tracking-widest text-primary dark:text-white">{{ modalSetupData.secret }}</code>
            </div>

            <AppInput
              v-model="modalVerificationCode"
              label="CÓDIGO DE 6 DÍGITOS GERADO NO APP"
              placeholder="000000"
              type="text"
              maxlength="6"
              required
              @keyup.enter="confirmProfile2FA"
            />
          </template>
        </div>

        <div class="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button 
            type="button"
            class="w-full sm:w-auto flex-1 py-3 bg-black dark:bg-white text-white dark:text-neutral-950 font-label-caps text-xs uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors active:scale-95 disabled:opacity-50"
            :disabled="loadingConfirm2FA || loadingSetupData"
            @click="confirmProfile2FA"
          >
            <span v-if="!loadingConfirm2FA">CONFIRMAR & ATIVAR</span>
            <span v-else>VALIDANDO...</span>
          </button>

          <button 
            type="button"
            class="w-full sm:w-auto px-6 py-3 border border-black dark:border-white/40 font-label-caps text-xs uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-colors bg-white dark:bg-neutral-800 dark:text-white active:scale-95" 
            @click="showSetup2FAModal = false"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Desativação de Conta -->
    <div v-if="showDeactivateDialog" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="relative max-w-md w-full bg-white dark:bg-neutral-900 border border-black dark:border-white/30 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.18)] flex flex-col gap-6">
        <div class="flex items-start gap-4">
          <span class="material-symbols-outlined text-error dark:text-red-400 text-4xl animate-bounce">warning</span>
          <div class="space-y-2">
            <h3 class="font-label-caps text-lg uppercase tracking-wider text-error dark:text-red-400 font-bold">DESATIVAR CONTA?</h3>
            <p class="font-detail-mono text-xs opacity-75 uppercase">
              Esta ação é irreversível. Você perderá o acesso aos seus agendamentos e dados de cadastro imediatamente.
            </p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <button 
            class="w-full sm:w-auto px-8 py-3 bg-error text-white font-label-caps text-xs uppercase tracking-widest hover:bg-red-800 transition-colors active:scale-95"
            @click="confirmDeactivate"
          >
            SIM, DESATIVAR
          </button>
          
          <button 
            class="w-full sm:w-auto px-8 py-3 border border-black dark:border-white/40 font-label-caps text-xs uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-colors bg-white dark:bg-neutral-800 dark:text-white active:scale-95" 
            type="button"
            @click="showDeactivateDialog = false"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = useToast()

const userId = ref('TW-4921')
const sidebarOpen = ref(false)
const saving = ref(false)
const pageLoading = ref(true)
const showDeactivateDialog = ref(false)

// Estado do 2FA
const twoFactorEnabled = ref(false)
const showSetup2FAModal = ref(false)
const loadingSetupData = ref(false)
const loadingConfirm2FA = ref(false)
const modalVerificationCode = ref('')
const modalSetupData = ref({
  secret: '',
  qr_code: '',
  otpauth_url: ''
})

const profile = ref({
  fullName: '',
  email: '',
  phone: '',
  documentNumber: '',
  birthDate: ''
})

onMounted(() => {
  const token = useCookie('auth_token').value
  if (!token || token.trim() === '') {
    router.push('/login?reason=no-auth')
  } else {
    setTimeout(() => {
      pageLoading.value = false
    }, 600)
  }

  getProfile()
})

async function getProfile() {
  try {

    const clientId = await getClientId()
    if (!clientId) {
      throw new Error('Cliente não encontrado.')
    }

    const response = await useApi<any>(`/cliente/${clientId}`, 'GET', {}, {})

    if (response.data) {
      profile.value.fullName = response.data.nome
      profile.value.email = response.data.email

      const rawPhone = response.data.telefone || ''
      profile.value.phone = rawPhone.replace(/\D/g, '').replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
      
      const rawCpf = response.data.cpf || ''
      profile.value.documentNumber = rawCpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')

      if (response.data.data_nascimento) {
        profile.value.birthDate = new Date(response.data.data_nascimento).toISOString().substring(0, 10)
      }

      twoFactorEnabled.value = Boolean(response.data.two_factor_enabled)

    }

  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'ERRO AO CARREGAR PERFIL',
      detail: error?.data?.error?.message || 'Erro ao carregar as informações. Verifique seus dados e tente novamente.',
      life: 4000
    })
    
  }
}

const security = ref({
  currentPassword: '',
  newPassword: ''
})

const handleSave = async () => {
  saving.value = true

  try {

    const clientId = await getClientId()

    const payload = {
      nome: profile.value.fullName,
      email: profile.value.email,
      telefone: profile.value.phone,
      cpf: profile.value.documentNumber.replace(/\D/g, ''),
      senha_atual: '',
      senha: ''
    }

    if (security.value.newPassword && security.value.newPassword !== '' && security.value.newPassword !== security.value.currentPassword) {
      payload.senha_atual = security.value.currentPassword
      payload.senha = security.value.newPassword
    }

    const response = await useApi<any>(`/cliente/${clientId}`, 'PUT', {}, payload)

    const id = response?.data?.id || response?.id
    const name = response?.data?.nome || response?.nome

    if (id) {
      await setClientId(id)
    } else {
      throw new Error('ID do cliente não retornado pela API.')
    }

    if (name) {
      await setClientName(name)
    } else {
      throw new Error('Nome do cliente não retornado pela API.')
    }

    toast.add({
      severity: 'success',
      summary: 'Perfil atualizado com sucesso',
      detail: 'Suas informações foram atualizadas com sucesso.',
      life: 3000
    })
    
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'ERRO AO SALVAR INFORMAÇÕES',
      detail: error?.data?.error?.message || 'Erro ao atualizar as informações. Verifique seus dados e tente novamente.',
      life: 4000
    })
    
  } finally {
    saving.value = false
  }
}

const openSetupModal = async () => {
  showSetup2FAModal.value = true
  loadingSetupData.value = true
  modalVerificationCode.value = ''

  try {
    const response = await useApi<any>('/2fa/setup', 'GET')
    const data = response?.data || response
    modalSetupData.value = {
      secret: data.secret,
      qr_code: data.qr_code,
      otpauth_url: data.otpauth_url
    }
  } catch (error: any) {
    console.error('Erro ao gerar setup 2FA:', error)
    toast.add({
      severity: 'error',
      summary: 'ERRO AO GERAR QR CODE',
      detail: error?.data?.error?.message || 'Não foi possível gerar a chave do autenticador.',
      life: 4000
    })
    showSetup2FAModal.value = false
  } finally {
    loadingSetupData.value = false
  }
}

const confirmProfile2FA = async () => {
  const cleanCode = modalVerificationCode.value.trim().replace(/\D/g, '')
  if (cleanCode.length !== 6) {
    toast.add({
      severity: 'warn',
      summary: 'CÓDIGO INCOMPLETO',
      detail: 'Digite o código de 6 dígitos gerado pelo Google Authenticator.',
      life: 3000
    })
    return
  }

  loadingConfirm2FA.value = true

  try {
    await useApi<any>('/2fa/confirm', 'POST', {}, {
      secret: modalSetupData.value.secret,
      code: cleanCode
    })

    twoFactorEnabled.value = true
    showSetup2FAModal.value = false

    toast.add({
      severity: 'success',
      summary: '2FA CONFIGURADO',
      detail: 'Autenticação em dois fatores ativada com sucesso no seu perfil!',
      life: 4000
    })
  } catch (error: any) {
    console.error('Erro ao confirmar 2FA:', error)
    toast.add({
      severity: 'error',
      summary: 'CÓDIGO INVÁLIDO',
      detail: error?.data?.error?.message || 'Código do autenticador inválido.',
      life: 4000
    })
  } finally {
    loadingConfirm2FA.value = false
  }
}

const toggle2FA = async (enable: boolean) => {
  if (!enable) {
    try {
      await useApi<any>('/2fa/toggle', 'POST', {}, { enabled: false })
      twoFactorEnabled.value = false
      toast.add({
        severity: 'info',
        summary: '2FA DESATIVADO',
        detail: 'A autenticação em dois fatores foi desativada.',
        life: 3000
      })
    } catch (error: any) {
      toast.add({
        severity: 'error',
        summary: 'ERRO AO DESATIVAR',
        detail: error?.data?.error?.message || 'Não foi possível desativar o 2FA.',
        life: 4000
      })
    }
  } else {
    openSetupModal()
  }
}

// const changePhoto = () => {
//   alert('Seletor de imagem de perfil (Simulado).')
// }

const cancel = () => {
  router.push('/agendamentos')
}

const deactivateAccount = () => {
  showDeactivateDialog.value = true
}

const confirmDeactivate = async () => {

  await useApi<any>('/logout', 'POST', {})

  showDeactivateDialog.value = false
  saving.value = true

  try {
    const clientId = await getClientId()

    await useApi<any>(`/cliente/${clientId}`, 'DELETE', {}, {})

    toast.add({
      severity: 'success',
      summary: 'CONTA DESATIVADA',
      detail: 'Sua conta foi desativada com sucesso.',
      life: 3000
    })

    // Limpa os dados de login e cookies de sessão do usuário
    await removeAuthToken()
    await removeClientId()
    await removeClientName()

    router.push('/cadastro')
    
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'ERRO AO DESATIVAR CONTA',
      detail: error?.data?.error?.message || 'Erro ao desativar sua conta. Tente novamente mais tarde.',
      life: 4000
    })
    
  } finally {
    saving.value = false
  }
}
</script>
