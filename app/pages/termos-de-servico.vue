<template>
  <div class="bg-surface dark:bg-neutral-950 text-on-surface dark:text-neutral-100 font-body-md min-h-screen flex flex-col relative transition-colors">
    <!-- Page Loader -->
    <div v-if="pageLoading" class="fixed inset-0 bg-surface dark:bg-neutral-950 z-50 flex flex-col items-center justify-center gap-4">
      <div class="fixed inset-0 bg-noise z-0 pointer-events-none"></div>
      <div class="relative z-10 border border-black dark:border-white/30 p-8 bg-white dark:bg-neutral-900 flex flex-col items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
        <span class="font-detail-mono text-detail-mono uppercase tracking-widest font-bold text-primary dark:text-white">CARREGANDO DADOS...</span>
      </div>
    </div>

    <div v-else class="flex flex-col flex-grow w-full relative">
      <!-- Subtle Background Texture -->
      <div class="fixed inset-0 bg-noise z-0"></div>

      <!-- Header component -->
      <AppHeader breadcrumb="TERMOS" :user-id="userId" />

      <!-- Main Content Container -->
      <main class="max-w-4xl mx-auto w-full px-4 md:px-12 py-12 flex-grow relative z-10 space-y-10">
        <!-- Page Title -->
        <div class="border-b border-black/10 dark:border-white/10 pb-8 space-y-3">
          <div class="flex items-center gap-3">
            <span class="font-detail-mono text-xs border border-black dark:border-white/40 px-2 py-1">LEGAL</span>
            <span class="font-detail-mono text-xs uppercase opacity-60 dark:text-neutral-400">
              THE WAY COLLECTIVE — ATUALIZADO EM 2026
            </span>
          </div>
          <h1 class="font-headline-xl text-3xl sm:text-headline-xl uppercase tracking-tighter">
            TERMOS DE SERVIÇO
          </h1>
          <p class="font-body-md text-sm opacity-75 leading-relaxed">
            Estes termos definem as condições de uso do portal de agendamentos para os clientes cadastrados da The Way Collective.
          </p>
        </div>

        <!-- Sections -->
        <div class="space-y-6">
          <section class="border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-900 p-6 md:p-8 space-y-3">
            <div class="flex items-center gap-3">
              <span class="font-detail-mono text-xs border border-black dark:border-white/40 px-2 py-0.5">01</span>
              <h2 class="font-headline-lg-mobile text-lg sm:text-headline-lg-mobile uppercase tracking-tight">
                USO DA PLATAFORMA
              </h2>
            </div>
            <p class="font-body-md text-sm leading-relaxed opacity-85">
              O portal destina-se exclusivamente ao agendamento e acompanhamento de serviços presenciais de barbearia por clientes devidamente cadastrados e autenticados.
            </p>
          </section>

          <section class="border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-900 p-6 md:p-8 space-y-3">
            <div class="flex items-center gap-3">
              <span class="font-detail-mono text-xs border border-black dark:border-white/40 px-2 py-0.5">02</span>
              <h2 class="font-headline-lg-mobile text-lg sm:text-headline-lg-mobile uppercase tracking-tight">
                AGENDAMENTOS E PONTUALIDADE
              </h2>
            </div>
            <p class="font-body-md text-sm leading-relaxed opacity-85">
              Cada reserva realizada fica vinculada ao serviço escolhido, ao profissional selecionado, à data, ao horário e à duração estimada exibida no momento da confirmação. Recomenda-se chegar com antecedência para manter a grade de atendimentos.
            </p>
          </section>

          <section class="border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-900 p-6 md:p-8 space-y-3">
            <div class="flex items-center gap-3">
              <span class="font-detail-mono text-xs border border-black dark:border-white/40 px-2 py-0.5">03</span>
              <h2 class="font-headline-lg-mobile text-lg sm:text-headline-lg-mobile uppercase tracking-tight">
                CANCELAMENTO E REAGENDAMENTO
              </h2>
            </div>
            <p class="font-body-md text-sm leading-relaxed opacity-85">
              Cancelamentos e reagendamentos devem ser solicitados com no mínimo 2 horas de antecedência em relação ao horário marcado, permitindo que o espaço fique disponível para outros clientes.
            </p>
          </section>

          <section class="border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-900 p-6 md:p-8 space-y-3">
            <div class="flex items-center gap-3">
              <span class="font-detail-mono text-xs border border-black dark:border-white/40 px-2 py-0.5">04</span>
              <h2 class="font-headline-lg-mobile text-lg sm:text-headline-lg-mobile uppercase tracking-tight">
                RESPONSABILIDADES DA CONTA
              </h2>
            </div>
            <p class="font-body-md text-sm leading-relaxed opacity-85">
              O cliente é responsável pela veracidade das informações fornecidas no cadastro e pela guarda segura de sua senha e códigos de verificação em duas etapas (2FA).
            </p>
          </section>

          <section class="border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-900 p-6 md:p-8 space-y-3">
            <div class="flex items-center gap-3">
              <span class="font-detail-mono text-xs border border-black dark:border-white/40 px-2 py-0.5">05</span>
              <h2 class="font-headline-lg-mobile text-lg sm:text-headline-lg-mobile uppercase tracking-tight">
                ATUALIZAÇÕES DOS TERMOS
              </h2>
            </div>
            <p class="font-body-md text-sm leading-relaxed opacity-85">
              Estes termos podem ser atualizados para refletir melhorias no atendimento ou nos processos do estúdio, mantendo-se sempre a versão vigente disponível para consulta de clientes logados.
            </p>
          </section>
        </div>

        <!-- Back Navigation -->
        <div class="pt-4">
          <NuxtLink
            to="/agendamentos"
            class="inline-flex items-center gap-2 border border-black dark:border-white/40 px-6 py-3 font-label-caps text-xs uppercase tracking-widest bg-white dark:bg-neutral-900 text-primary dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-all"
          >
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            <span>VOLTAR PARA AGENDAMENTOS</span>
          </NuxtLink>
        </div>
      </main>

      <!-- Footer component -->
      <AppFooter variant="full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getClientId, getClientName } from '~/composables/api'

const userId = ref('')
const pageLoading = ref(true)

onMounted(async () => {
  const token = useCookie('auth_token').value
  if (!token || token.trim() === '') {
    navigateTo('/login?reason=no-auth')
    return
  }

  const clientId = await getClientId()
  const clientName = await getClientName()
  if (clientName && clientId) {
    userId.value = `${clientName} (#${clientId})`
  } else if (clientName) {
    userId.value = clientName
  } else if (clientId) {
    userId.value = `ID #${clientId}`
  }

  pageLoading.value = false
})
</script>

