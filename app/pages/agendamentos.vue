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
      <AppHeader :user-id="userId" />

    <!-- Tabs Container (PrimeVue Tabs) -->
    <Tabs v-model:value="activeTab" class="w-full flex-grow flex flex-col relative z-10">
      <!-- Tab Navigation System (PrimeVue TabList) -->
      <TabList
        :pt="{
          root: 'w-full border-b border-black/10 dark:border-white/10 bg-surface dark:bg-neutral-950 relative z-10 transition-colors',
          content: 'max-w-[1280px] mx-auto px-4 md:px-12',
          tablist: 'flex gap-5 sm:gap-8',
          nextButton: 'hidden',
          prevButton: 'hidden'
        }"
      >
        <Tab 
          value="novo"
          class="py-4 sm:py-6 font-label-caps text-[11px] sm:text-label-caps uppercase tracking-widest transition-all focus:outline-none cursor-pointer border-b-2"
          :class="activeTab === 'novo' ? 'border-primary dark:border-white font-bold text-primary dark:text-white' : 'border-transparent text-primary/60 dark:text-neutral-400 hover:text-primary dark:hover:text-white'"
          @click="selectServiceType('barbearia')"
        >
          NOVO AGENDAMENTO
        </Tab>
        <Tab 
          value="meus"
          class="py-4 sm:py-6 font-label-caps text-[11px] sm:text-label-caps uppercase tracking-widest transition-all focus:outline-none cursor-pointer border-b-2"
          :class="activeTab === 'meus' ? 'border-primary dark:border-white font-bold text-primary dark:text-white' : 'border-transparent text-primary/60 dark:text-neutral-400 hover:text-primary dark:hover:text-white'"
          @click="loadBookings"
        >
          AGENDA
        </Tab>
      </TabList>

      <!-- Main Content Container -->
      <main class="max-w-[1280px] mx-auto w-full px-4 md:px-12 py-8 sm:py-12 flex-grow relative z-10">
        <TabPanels>
          <!-- VIEW 1: NOVO AGENDAMENTO -->
          <TabPanel value="novo" class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
            <!-- Left Side: Stepper Form -->
            <div class="lg:col-span-8 space-y-12 md:space-y-24">
              
              <!-- Step 1: Service Selection -->
              <section class="page-transition">
                <div class="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <span class="font-detail-mono text-xs sm:text-detail-mono border border-black dark:border-white/40 px-2 py-1 shrink-0">01</span>
                  <h2 class="font-headline-xl text-2xl sm:text-4xl md:text-headline-xl uppercase tracking-tighter">SELECIONE O SERVIÇO</h2>
                </div>
                
                <div class="grid grid-cols-1 gap-4">
                  <!-- Barber Option (Exclusivo) -->
                  <div class="relative">
                    <input 
                      id="service_barber" 
                      type="radio" 
                      name="service" 
                      value="barbearia" 
                      :checked="booking.service === 'barbearia'" 
                      class="hidden"
                    />
                    <label 
                      for="service_barber"
                      class="block border p-5 sm:p-8 hover:border-black dark:hover:border-white transition-all group rounded-none bg-primary dark:bg-neutral-900 text-on-primary dark:text-white border-primary dark:border-white"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="material-symbols-outlined text-3xl sm:text-4xl mb-3 sm:mb-4">content_cut</span>
                          <h3 class="font-headline-lg-mobile text-lg sm:text-headline-lg-mobile uppercase mb-1.5 sm:mb-2">BARBEARIA</h3>
                          <p class="font-detail-mono text-xs sm:text-detail-mono opacity-80">Cortes clássicos, barba modelada e cuidados masculinos.</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Sub-serviços com preços e tempos carregados diretamente do banco de dados -->
                <div v-if="availableSubServices.length > 0" class="mt-6 pt-6 border-t border-black/10 dark:border-white/10">
                  <h4 class="font-detail-mono text-xs sm:text-detail-mono uppercase mb-4 opacity-60">Escolha o Serviço de Barbearia:</h4>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button 
                      v-for="sub in availableSubServices" 
                      :key="sub.value"
                      type="button"
                      class="border p-3 sm:p-4 text-left transition-all relative"
                      :class="booking.subService === sub.value ? 'bg-primary text-on-primary border-primary dark:bg-white dark:text-neutral-950 dark:border-white font-bold shadow-sm' : 'border-black/10 dark:border-white/15 hover:border-black dark:hover:border-white bg-white dark:bg-neutral-900 dark:text-neutral-100'"
                      @click="selectSubService(sub)"
                    >
                      <span 
                        v-if="sub.em_promocao"
                        class="font-detail-mono text-[9px] px-1.5 py-0.5 border border-red-500 dark:border-red-500/70 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold uppercase inline-flex items-center gap-1 mb-1.5"
                        :class="{ '!bg-white !text-red-600 !border-white dark:!bg-red-600 dark:!text-white dark:!border-red-600': booking.subService === sub.value }"
                      >
                        <span class="material-symbols-outlined text-[10px]">local_offer</span>
                        {{ sub.tag_promocao || 'PROMOÇÃO' }}
                      </span>
                      <span class="block font-label-caps text-[11px] sm:text-xs uppercase">{{ sub.label }}</span>
                      <span
                        class="block font-headline-lg-mobile text-xs sm:text-sm font-bold mt-1"
                        :class="booking.subService === sub.value ? 'text-on-primary dark:text-neutral-950' : 'text-primary dark:text-white'"
                      >
                        R$ {{ Number(sub.price).toFixed(2) }}
                      </span>
                      <span class="block font-detail-mono text-[10px] opacity-75 mt-0.5">
                        <span class="material-symbols-outlined text-[10px] align-middle">schedule</span> {{ sub.duration }} min
                      </span>
                    </button>
                  </div>

                  <!-- Recado / Observação Técnica do Profissional sobre o serviço selecionado -->
                  <div v-if="selectedSubService?.observacao" class="mt-4 p-3 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 border-l-4 border-l-primary dark:border-l-white flex items-start gap-2.5">
                    <span class="material-symbols-outlined text-sm text-primary dark:text-white mt-0.5">info</span>
                    <div>
                      <span class="font-detail-mono text-[10px] uppercase font-bold text-primary dark:text-white block">
                        Instruções do Barbeiro para este serviço:
                      </span>
                      <p class="font-body-md text-xs opacity-85 mt-0.5 leading-relaxed italic">
                        "{{ selectedSubService.observacao }}"
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Step 2: Specialist Selection -->
              <section class="page-transition" :class="{ 'opacity-30 pointer-events-none': !booking.service }">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                  <div class="flex items-center gap-3 sm:gap-4">
                    <span class="font-detail-mono text-xs sm:text-detail-mono border border-black dark:border-white/40 px-2 py-1 shrink-0">02</span>
                    <h2 class="font-headline-xl text-2xl sm:text-4xl md:text-headline-xl uppercase tracking-tighter">ESPECIALISTA</h2>
                  </div>

                  <!-- Campo de Busca Dinâmica por Especialista -->
                  <div class="relative w-full sm:w-72">
                    <input 
                      v-model="specialistSearch"
                      type="text"
                      placeholder="BUSCAR ESPECIALISTA..."
                      class="w-full bg-white dark:bg-neutral-900 dark:text-neutral-100 border border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white py-2.5 pl-9 pr-8 font-detail-mono text-xs uppercase placeholder:opacity-40 dark:placeholder:text-neutral-500 transition-all rounded-none outline-none"
                      @input="onSearchInput"
                    />
                    <span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-sm opacity-50">search</span>
                    <button 
                      v-if="specialistSearch" 
                      type="button" 
                      class="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 flex items-center"
                      @click="clearSpecialistSearch"
                    >
                      <span class="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                </div>

                <div v-if="filteredSpecialists.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div 
                    v-for="spec in filteredSpecialists" 
                    :key="spec.id" 
                    class="group cursor-pointer"
                    @click="selectSpecialist(spec)"
                  >
                    <div 
                      class="aspect-[3/4] overflow-hidden border mb-4 transition-all duration-300 relative flex items-center justify-center bg-surface-container/60 dark:bg-neutral-900 group-hover:border-black dark:group-hover:border-white"
                      :class="booking.specialist?.id === spec.id ? 'border-primary dark:border-white border-4 bg-surface-variant dark:bg-neutral-800' : 'border-black/10 dark:border-white/15'"
                    >
                      <!-- Imagem do profissional (caso cadastrada) -->
                      <img 
                        v-if="spec.image && !spec.imageError" 
                        class="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105" 
                        :src="spec.image" 
                        :alt="spec.name"
                        referrerpolicy="no-referrer"
                        @error="spec.imageError = true"
                      />

                      <!-- Somente as iniciais do profissional -->
                      <div v-else class="w-full h-full flex items-center justify-center bg-surface-container/60 dark:bg-neutral-900 select-none transition-colors group-hover:bg-surface-variant dark:group-hover:bg-neutral-800">
                        <span class="font-headline-xl text-5xl sm:text-6xl font-bold tracking-tighter text-gray-300 dark:text-neutral-600 transition-all duration-300 group-hover:text-gray-400 dark:group-hover:text-neutral-500 group-hover:scale-105">
                          {{ getSpecialistInitials(spec.name) }}
                        </span>
                      </div>
                    </div>
                    <h4 class="font-body-md text-sm sm:text-body-md font-bold uppercase">{{ spec.name }}</h4>
                    <p class="font-detail-mono text-[11px] sm:text-detail-mono text-on-secondary-container dark:text-neutral-400">{{ spec.role }}</p>
                  </div>
                </div>

                <div v-else class="border border-dashed border-black/20 dark:border-white/20 p-6 sm:p-8 text-center bg-white/50 dark:bg-neutral-900/50">
                  <p class="font-detail-mono text-xs uppercase opacity-60">Nenhum especialista encontrado para "{{ specialistSearch }}"</p>
                </div>
              </section>

              <!-- Step 3: Date & Time -->
              <section class="page-transition pb-8 sm:pb-12" :class="{ 'opacity-30 pointer-events-none': !booking.specialist }">
                <div class="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <span class="font-detail-mono text-xs sm:text-detail-mono border border-black dark:border-white/40 px-2 py-1 shrink-0">03</span>
                  <h2 class="font-headline-xl text-2xl sm:text-4xl md:text-headline-xl uppercase tracking-tighter">DATA E HORA</h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <!-- Calendar UI -->
                  <div class="border border-black/10 dark:border-white/15 p-4 sm:p-6 bg-white dark:bg-neutral-900">
                    <div class="flex justify-between items-center mb-4 sm:mb-6">
                      <span class="font-detail-mono text-xs sm:text-detail-mono uppercase">Próximos Dias Disponíveis</span>
                      <span class="material-symbols-outlined text-primary dark:text-white">calendar_month</span>
                    </div>

                    <div class="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-xs">
                      <div 
                        v-for="day in dynamicCalendarDays" 
                        :key="day.dateStr"
                        class="p-2 cursor-pointer font-detail-mono transition-all flex flex-col items-center justify-center border"
                        :class="booking.date === day.dateStr ? 'bg-primary text-on-primary border-primary dark:bg-white dark:text-neutral-950 dark:border-white font-bold' : 'border-black/10 dark:border-white/15 hover:border-black dark:hover:border-white bg-surface/50 dark:bg-neutral-800/60'"
                        @click="selectDate(day.dateStr)"
                      >
                        <span class="text-[9px] uppercase opacity-60">{{ day.weekDay }}</span>
                        <span class="text-sm font-bold my-0.5">{{ day.dayNum }}</span>
                        <span class="text-[9px] uppercase opacity-60">{{ day.month }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Available Hours -->
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="font-detail-mono text-xs sm:text-detail-mono uppercase opacity-60">Horários</h4>
                      <span v-if="loadingHours" class="font-detail-mono text-[10px] text-primary dark:text-white flex items-center gap-1 font-bold animate-pulse">
                        <span class="material-symbols-outlined text-xs animate-spin">progress_activity</span>
                        CONSULTANDO...
                      </span>
                    </div>

                    <div v-if="!booking.date" class="border border-dashed border-black/20 dark:border-white/20 p-6 text-center bg-white/50 dark:bg-neutral-900/50">
                      <p class="font-detail-mono text-xs opacity-60 uppercase">SELECIONE UMA DATA PARA VER A DISPONIBILIDADE</p>
                    </div>

                    <div v-else-if="!loadingHours && !hasAvailableSlots" class="border border-dashed border-black/20 dark:border-white/20 p-6 text-center bg-white/50 dark:bg-neutral-900/50">
                      <p class="font-detail-mono text-xs opacity-70 uppercase font-bold">Sem agenda nesse dia</p>
                    </div>

                    <div v-else class="max-h-72 overflow-y-auto pr-1.5 custom-scrollbar">
                      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <button 
                          v-for="slot in currentSlots" 
                          :key="slot.hora" 
                          type="button"
                          :disabled="!slot.disponivel"
                          class="border py-2.5 sm:py-3 px-2 font-detail-mono transition-all rounded-full text-center text-xs sm:text-sm relative"
                          :class="[
                            !slot.disponivel 
                              ? 'opacity-40 cursor-not-allowed bg-neutral-100 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-600 border-neutral-300 dark:border-neutral-800' 
                              : booking.time === slot.hora 
                                ? 'bg-primary text-on-primary border-black dark:bg-white dark:text-neutral-950 dark:border-white font-bold shadow-sm' 
                                : 'border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white bg-white dark:bg-neutral-900 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800'
                          ]"
                          @click="slot.disponivel && (booking.time = slot.hora)"
                        >
                          <span :class="{ 'line-through': !slot.disponivel }">{{ slot.hora }}</span>
                          <span v-if="!slot.disponivel" class="block text-[8px] font-bold uppercase text-error dark:text-red-400 tracking-tighter">Ocupado</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Step 4: Observações Adicionais -->
              <section class="page-transition">
                <div class="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <span class="font-detail-mono text-xs sm:text-detail-mono border border-black dark:border-white/40 px-2 py-1 shrink-0">04</span>
                  <div class="flex items-baseline gap-2">
                    <h2 class="font-headline-xl text-2xl sm:text-4xl md:text-headline-xl uppercase tracking-tighter">OBSERVAÇÕES</h2>
                  </div>
                </div>

                <div class="space-y-2">
                  <AppInput
                    v-model="booking.observacoes"
                    type="textarea"
                    label="Alguma preferência, restrição ou detalhe especial para o profissional?"
                    placeholder="Ex: Tenho alergia a lâmina, prefiro máquina zero nas laterais, estilo específico..."
                    :rows="4"
                    :maxlength="65535"
                  />
                  <div class="flex justify-between items-center text-[11px] font-detail-mono text-on-surface-variant dark:text-neutral-400">
                    <span :class="(booking.observacoes || '').length >= 65535 ? 'text-error dark:text-red-400 font-bold' : 'opacity-70'">
                      {{ (booking.observacoes || '').length }} / 65535
                    </span>
                  </div>
                </div>
              </section>

            </div>

            <!-- Right Side: Floating Summary Panel -->
            <aside class="lg:col-span-4">
              <div class="sticky top-28 border border-black dark:border-white/30 p-5 sm:p-8 bg-surface dark:bg-neutral-900 shadow-lg lg:shadow-none relative z-10">
                <h3 class="font-headline-lg-mobile text-lg sm:text-headline-lg-mobile uppercase mb-6 sm:mb-8 pb-4 border-b border-black/10 dark:border-white/10">
                  RESUMO DO AGENDAMENTO
                </h3>
                
                <div class="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
                  <div class="flex flex-col gap-1">
                    <span class="font-detail-mono text-[10px] uppercase opacity-50">Serviço</span>
                    <span class="font-body-md text-sm sm:text-body-md font-bold uppercase tracking-tight">
                      {{ serviceDisplayName }}
                    </span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="font-detail-mono text-[10px] uppercase opacity-50">Especialista</span>
                    <span class="font-body-md text-sm sm:text-body-md font-bold uppercase tracking-tight">
                      {{ booking.specialist ? booking.specialist.name : 'Selecione um profissional' }}
                    </span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="font-detail-mono text-[10px] uppercase opacity-50">Data &amp; Horário</span>
                    <span class="font-body-md text-sm sm:text-body-md font-bold uppercase tracking-tight">
                      {{ dateDisplayName }}
                    </span>
                  </div>
                  <div v-if="booking.observacoes && booking.observacoes.trim()" class="flex flex-col gap-1">
                    <span class="font-detail-mono text-[10px] uppercase opacity-50">Observações</span>
                    <p class="font-body-md text-xs italic opacity-80 break-words line-clamp-3">
                      "{{ booking.observacoes.trim() }}"
                    </p>
                  </div>
                </div>

                <div class="flex justify-between items-end mb-6 sm:mb-8">
                  <span class="font-detail-mono text-xs sm:text-detail-mono uppercase">Total</span>
                  <span class="font-headline-lg text-2xl sm:text-headline-lg tracking-tighter">
                    R$ {{ totalPrice.toFixed(2) }}
                  </span>
                </div>

                <AppButton
                  type="button"
                  variant="primary"
                  icon="arrow_forward"
                  :disabled="!isBookingComplete"
                  :loading="confirming"
                  @click="openRulesModal"
                >
                  CONFIRMAR AGENDAMENTO
                </AppButton>
                
                <p class="mt-4 font-detail-mono text-[10px] sm:text-[11px] text-center opacity-40 leading-tight">
                  * POLÍTICA DE CANCELAMENTO: MÍNIMO 2 HORAS DE ANTECEDÊNCIA.
                </p>
              </div>
            </aside>
          </TabPanel>

          <!-- VIEW 2: MEUS AGENDAMENTOS -->
          <TabPanel value="meus" class="space-y-8 sm:space-y-12 min-h-[60vh]">
            <div class="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <span class="font-detail-mono text-xs sm:text-detail-mono border border-black dark:border-white/40 px-2 py-1 shrink-0">LISTA</span>
              <h2 class="font-headline-xl text-2xl sm:text-4xl md:text-headline-xl uppercase tracking-tighter">AGENDA</h2>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:gap-6">
              <div 
                v-for="item in activeBookings" 
                :key="item.id" 
                class="border border-black/10 dark:border-white/15 p-5 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center group hover:border-black dark:hover:border-white transition-all bg-white dark:bg-neutral-900"
              >
                <div class="flex flex-col p-0 sm:p-2 gap-3 sm:gap-4 md:flex-row md:items-center md:gap-8 lg:gap-12 flex-1 min-w-0">
                  <div class="flex flex-col flex-shrink-0">
                    <span class="font-detail-mono text-[10px] uppercase opacity-40 mb-1">Status</span>
                    <span 
                      class="font-label-caps text-[10px] border px-2 py-1 inline-block w-fit font-bold"
                      :class="item.status === 'CONFIRMADO' ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/60 dark:text-green-300 dark:border-green-800' : 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/60 dark:text-yellow-300 dark:border-yellow-800'"
                    >
                      {{ item.status }}
                    </span>
                  </div>
                  <div class="flex flex-col flex-shrink-0">
                    <span class="font-detail-mono text-[10px] uppercase opacity-40 mb-1">Serviço</span>
                    <div class="flex items-center gap-2 flex-wrap">
                      <h4 class="font-body-md text-sm sm:text-body-md font-bold uppercase">{{ item.serviceName }}</h4>
                      <span 
                        v-if="item.emPromocao"
                        class="font-detail-mono text-[9px] px-1.5 py-0.5 border border-red-500 dark:border-red-500/70 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold uppercase inline-flex items-center gap-1"
                      >
                        <span class="material-symbols-outlined text-[10px]">local_offer</span>
                        {{ item.tagPromocao || 'PROMOÇÃO' }}
                      </span>
                    </div>
                    <p class="font-detail-mono text-[11px] sm:text-xs opacity-60">{{ item.category }}</p>
                  </div>
                  <div class="flex flex-col flex-shrink-0">
                    <span class="font-detail-mono text-[10px] uppercase opacity-40 mb-1">Profissional</span>
                    <h4 class="font-body-md text-sm sm:text-body-md font-bold uppercase">{{ item.specialistName }}</h4>
                  </div>
                  <div class="flex flex-col flex-shrink-0">
                    <span class="font-detail-mono text-[10px] uppercase opacity-40 mb-1">Data &amp; Hora</span>
                    <h4 class="font-body-md text-sm sm:text-body-md font-bold uppercase">{{ item.dateTime }}</h4>
                  </div>
                  <!-- Valor salvo no agendamento -->
                  <div class="flex flex-col flex-shrink-0">
                    <span class="font-detail-mono text-[10px] uppercase opacity-40 mb-1">Valor</span>
                    <h4 class="font-body-md text-sm sm:text-body-md font-bold text-primary dark:text-white">{{ formatPrice(item.price) }}</h4>
                  </div>
                  <!-- Observação do Serviço cadastrada pelo profissional -->
                  <div v-if="item.servicoObservacao" class="flex flex-col min-w-0 max-w-[160px] md:max-w-[200px] lg:max-w-xs flex-1">
                    <span class="font-detail-mono text-[10px] uppercase text-primary dark:text-white font-bold mb-1">Recado do Barbeiro</span>
                    <p 
                      class="font-body-md text-xs italic opacity-85 truncate cursor-pointer hover:opacity-100 hover:underline transition-all block w-full" 
                      :title="item.servicoObservacao"
                      @click="selectedObservacao = item.servicoObservacao"
                    >
                      "{{ item.servicoObservacao }}"
                    </p>
                  </div>
                  <!-- Observações enviadas no agendamento -->
                  <div v-if="item.observacoes" class="flex flex-col min-w-0 max-w-[160px] md:max-w-[200px] lg:max-w-xs flex-1 m-0">
                    <!-- <span class="font-detail-mono text-[10px] uppercase opacity-40 mb-1">Observações</span> -->
                    <p 
                      class="font-body-md text-xs italic opacity-75 truncate cursor-pointer hover:opacity-100 hover:underline transition-all block w-full text-[8px]" 
                      :title="item.observacoes"
                      @click="selectedObservacao = item.observacoes"
                    >
                      Obs...
                    </p>
                  </div>
                </div>
                
                <div class="flex gap-4 mt-6 md:mt-0 w-full md:w-auto">
                  <button 
                    class="flex-1 md:flex-none border border-black dark:border-white/40 px-6 py-2 font-label-caps text-[10px] uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-all bg-white dark:bg-neutral-800 dark:text-white"
                    @click="rebook(item)"
                  >
                    REAGENDAR
                  </button>
                  <button 
                    class="flex-1 md:flex-none border border-error/20 dark:border-red-500/40 text-error dark:text-red-400 px-6 py-2 font-label-caps text-[10px] uppercase tracking-widest hover:bg-error hover:text-on-error dark:hover:bg-red-600 dark:hover:text-white transition-all bg-white dark:bg-neutral-900"
                    @click="cancelBooking(item.id)"
                  >
                    CANCELAR
                  </button>
                </div>
              </div>

              <div v-if="activeBookings.length === 0" class="text-center py-12 border border-dashed border-black/10 dark:border-white/15">
                <p class="font-detail-mono text-on-surface-variant dark:text-neutral-400">Nenhum agendamento futuro encontrado.</p>
              </div>
            </div>

            <!-- History Section -->
            <div class="pt-12 max-h-[50vh] overflow-y-auto border-t border-black/5 dark:border-white/10">
              <h3 class="font-label-caps text-label-caps uppercase opacity-40 mb-6">HISTÓRICO</h3>

              <!-- Cabeçalho das colunas do histórico -->
              <div v-if="historyBookings.length > 0" class="grid grid-cols-5 gap-2 py-2 px-3 sm:px-8 font-detail-mono text-[9px] sm:text-[10px] uppercase opacity-40">
                <span>Serviço</span>
                <span>Profissional</span>
                <span class="text-right">Data &amp; Hora</span>
                <span class="text-right">Valor</span>
                <span class="text-right">Status</span>
              </div>

              <div class="space-y-3 sm:space-y-4">
                <div 
                  v-for="hist in historyBookings" 
                  :key="hist.id"
                  class="grid grid-cols-5 gap-2 py-3 sm:py-4 px-3 sm:px-8 border-b border-black/5 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 hover:bg-white dark:hover:bg-neutral-900 transition-all items-center"
                >
                  <span class="font-detail-mono text-[10px] sm:text-xs uppercase text-on-surface dark:text-neutral-100 font-medium truncate">{{ hist.serviceName }}</span>
                  <span class="font-detail-mono text-[10px] sm:text-xs uppercase text-on-surface-variant dark:text-neutral-400 truncate">{{ hist.specialistName }}</span>
                  <span class="font-detail-mono text-[10px] sm:text-xs uppercase text-right text-on-surface-variant dark:text-neutral-400">{{ hist.dateTime }}</span>
                  <span class="font-detail-mono text-[10px] sm:text-xs uppercase text-right font-bold text-primary dark:text-white">
                    {{ formatPrice(hist.price) }}
                  </span>
                  <span 
                    class="font-detail-mono text-[10px] sm:text-xs uppercase text-right font-bold"
                    :class="{
                      'text-error dark:text-red-400': hist.rawStatus === 'Cancelado' || hist.rawStatus === 'Faltou',
                      'text-green-700 dark:text-green-400': hist.rawStatus === 'Concluido',
                      'text-on-surface dark:text-neutral-100': hist.rawStatus !== 'Cancelado' && hist.rawStatus !== 'Faltou' && hist.rawStatus !== 'Concluido'
                    }"
                  >
                    {{ hist.rawStatus || hist.status }}
                  </span>
                </div>

                <div v-if="historyBookings.length === 0" class="text-center py-8 border border-dashed border-black/10 dark:border-white/15">
                  <p class="font-detail-mono text-xs text-on-surface-variant dark:text-neutral-400">Nenhum agendamento no histórico.</p>
                </div>
              </div>
            </div>

          </TabPanel>
        </TabPanels>
      </main>
    </Tabs>

    <!-- Footer component -->
    <AppFooter variant="full" />
    </div>

    <!-- Modal de Observação Completa -->
    <div 
      v-if="selectedObservacao !== null" 
      class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      @click.self="selectedObservacao = null"
    >
      <div class="bg-surface dark:bg-neutral-900 border border-black dark:border-white/30 p-8 max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl relative">
        <div class="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10 mb-6">
          <div class="flex items-center gap-3">
            <span class="font-detail-mono text-xs border border-black dark:border-white/40 px-2 py-1">OBS</span>
            <h3 class="font-headline-lg-mobile text-lg sm:text-headline-lg-mobile uppercase">OBSERVAÇÕES DO AGENDAMENTO</h3>
          </div>
          <button 
            type="button"
            class="material-symbols-outlined text-primary dark:text-white hover:opacity-60 transition-opacity"
            @click="selectedObservacao = null"
          >
            close
          </button>
        </div>

        <div class="overflow-y-auto pr-2 font-body-md text-sm whitespace-pre-wrap break-words opacity-90 flex-1 leading-relaxed max-h-[50vh]">
          {{ selectedObservacao }}
        </div>

        <div class="pt-6 border-t border-black/10 dark:border-white/10 mt-6 flex justify-end">
          <AppButton variant="secondary" @click="selectedObservacao = null">
            FECHAR
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Modal de Regras da Barbearia -->
    <div 
      v-if="showRulesModal" 
      class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      @click.self="closeRulesModal"
    >
      <div class="bg-surface dark:bg-neutral-900 border border-black dark:border-white/30 p-6 md:p-8 max-w-lg w-full max-h-[85vh] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.18)] relative">
        <div class="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10 mb-5">
          <div class="flex items-center gap-3">
            <span class="font-detail-mono text-xs border border-black dark:border-white/40 px-2 py-1">REGRAS</span>
            <h3 class="font-headline-lg-mobile text-lg sm:text-headline-lg-mobile uppercase">REGRAS DA BARBEARIA</h3>
          </div>
          <button 
            type="button"
            class="material-symbols-outlined text-primary dark:text-white hover:opacity-60 transition-opacity disabled:opacity-30"
            :disabled="confirming"
            @click="closeRulesModal"
          >
            close
          </button>
        </div>

        <div class="overflow-y-auto pr-2 space-y-4 flex-1 custom-scrollbar">
          <!-- Mini resumo da reserva -->
          <div class="bg-white dark:bg-neutral-800/60 border border-black/10 dark:border-white/15 p-3 space-y-1">
            <p class="font-detail-mono text-[10px] uppercase opacity-60">Resumo da Reserva</p>
            <p class="font-body-md text-xs font-bold uppercase">
              {{ serviceDisplayName }} — {{ booking.specialist?.name }}
            </p>
            <div class="flex items-center justify-between font-detail-mono text-xs opacity-80">
              <span>{{ dateDisplayName }}</span>
              <span class="font-bold text-primary dark:text-white">R$ {{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Lista de regras -->
          <div class="space-y-3">
            <div class="border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-900 p-3.5 flex items-start gap-3">
              <span class="font-detail-mono text-xs border border-black dark:border-white/40 px-1.5 py-0.5 shrink-0">01</span>
              <p class="font-body-md text-xs leading-relaxed opacity-90">
                <strong>Pontualidade:</strong> Chegue com pelo menos 5 minutos de antecedência. A tolerância máxima de atraso é de 10 minutos; após esse prazo, o horário poderá ser cancelado para não prejudicar o próximo cliente.
              </p>
            </div>
            <div class="border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-900 p-3.5 flex items-start gap-3">
              <span class="font-detail-mono text-xs border border-black dark:border-white/40 px-1.5 py-0.5 shrink-0">02</span>
              <p class="font-body-md text-xs leading-relaxed opacity-90">
                <strong>Cancelamento e Reagendamento:</strong> Solicitações devem ser feitas com no mínimo 2 horas de antecedência diretamente pela sua Agenda.
              </p>
            </div>
            <div class="border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-900 p-3.5 flex items-start gap-3">
              <span class="font-detail-mono text-xs border border-black dark:border-white/40 px-1.5 py-0.5 shrink-0">03</span>
              <p class="font-body-md text-xs leading-relaxed opacity-90">
                <strong>Aviso de Falta:</strong> Caso ocorra qualquer imprevisto, cancele ou avise o quanto antes para liberar o horário a outros clientes.
              </p>
            </div>
            <div class="border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-900 p-3.5 flex items-start gap-3">
              <span class="font-detail-mono text-xs border border-black dark:border-white/40 px-1.5 py-0.5 shrink-0">04</span>
              <p class="font-body-md text-xs leading-relaxed opacity-90">
                <strong>Cuidados e Restrições:</strong> Informe ao profissional no campo de observações ou antes do atendimento caso possua alergias, sensibilidade na pele ou preferências específicas.
              </p>
            </div>
            <div class="border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-900 p-3.5 flex items-start gap-3">
              <span class="font-detail-mono text-xs border border-black dark:border-white/40 px-1.5 py-0.5 shrink-0">05</span>
              <p class="font-body-md text-xs leading-relaxed opacity-90">
                <strong>Ambiente do Estúdio:</strong> Mantenha o respeito com os profissionais e demais clientes para preservar a experiência do estúdio.
              </p>
            </div>
          </div>

          <!-- Aceite das regras -->
          <label class="flex items-start gap-3 p-3.5 border border-black/20 dark:border-white/25 bg-white dark:bg-neutral-800/60 cursor-pointer select-none">
            <input 
              v-model="rulesAccepted" 
              type="checkbox" 
              class="mt-0.5 h-4 w-4 accent-black dark:accent-white cursor-pointer shrink-0"
            />
            <span class="font-detail-mono text-xs uppercase leading-relaxed">
              Li e concordo com as regras da barbearia para confirmar este agendamento.
            </span>
          </label>
        </div>

        <div class="pt-6 border-t border-black/10 dark:border-white/10 mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            type="button"
            class="w-full sm:w-auto px-6 py-3 border border-primary dark:border-white/40 bg-white dark:bg-neutral-900 text-primary dark:text-white hover:bg-secondary-container dark:hover:bg-neutral-800 font-label-caps text-label-caps uppercase tracking-widest transition-all disabled:opacity-50"
            :disabled="confirming"
            @click="closeRulesModal"
          >
            VOLTAR
          </button>
          <button
            type="button"
            class="w-full sm:w-auto px-6 py-3 bg-primary dark:bg-white text-on-primary dark:text-neutral-950 hover:bg-secondary dark:hover:bg-neutral-200 font-label-caps text-label-caps uppercase tracking-widest font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!rulesAccepted || confirming"
            @click="confirmBooking"
          >
            {{ confirming ? 'CONFIRMANDO...' : 'CONFIRMAR AGENDAMENTO' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useApi, getClientId, getClientName } from '~/composables/api'

const toast = useToast()
const confirm = useConfirm()
const userId = ref('')
const activeTab = ref('novo')
const confirming = ref(false)
const pageLoading = ref(true)
const selectedObservacao = ref<string | null>(null)
const showRulesModal = ref(false)
const rulesAccepted = ref(false)

// Dados do agendamento sendo feito
const booking = ref({
  service: 'barbearia',
  subService: '',
  specialist: null as any,
  date: '',
  time: '',
  observacoes: ''
})

// Mapeamento amigável dos tipos de serviço cadastrados no banco
const formatServiceLabel = (tipo: string): string => {
  switch (tipo) {
    case 'Corte': return 'Corte de Cabelo'
    case 'Barba': return 'Barba Modelada'
    case 'Corte_e_Barba': return 'Corte + Barba'
    case 'Sobrancelha': return 'Sobrancelha'
    case 'Outro': return 'Outro Serviço'
    default: return (tipo || '').replace(/_/g, ' ')
  }
}

// Formata o valor monetário salvo no agendamento (ex: 50 -> "R$ 50,00")
const formatPrice = (val: any): string => {
  const num = Number(val)
  if (isNaN(num) || num <= 0) return 'R$ 0,00'
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Retorna as iniciais do nome do profissional (ex: "Carlos Barbeiro" -> "CB")
const getSpecialistInitials = (name?: string): string => {
  if (!name) return 'PR'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'PR'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Sub-serviços com valores e tempos dinâmicos vindos da tabela 'servico' do banco
const availableSubServices = computed(() => {
  // Se um especialista já foi selecionado e tem serviços cadastrados
  if (booking.value.specialist?.servicos && booking.value.specialist.servicos.length > 0) {
    return booking.value.specialist.servicos.map((s: any) => ({
      label: formatServiceLabel(s.tipo_servico),
      value: s.tipo_servico,
      price: Number(s.valor),
      duration: s.duracao || 30,
      em_promocao: Boolean(s.em_promocao),
      tag_promocao: s.tag_promocao || '',
      observacao: s.observacao || ''
    }))
  }

  // Caso nenhum especialista específico esteja selecionado, consolida os serviços de todos os especialistas da categoria
  const mapUnique = new Map<string, any>()
  filteredSpecialists.value.forEach((spec: any) => {
    if (spec.servicos && Array.isArray(spec.servicos)) {
      spec.servicos.forEach((s: any) => {
        if (!mapUnique.has(s.tipo_servico)) {
          mapUnique.set(s.tipo_servico, {
            label: formatServiceLabel(s.tipo_servico),
            value: s.tipo_servico,
            price: Number(s.valor),
            duration: s.duracao || 30,
            em_promocao: Boolean(s.em_promocao),
            tag_promocao: s.tag_promocao || '',
            observacao: s.observacao || ''
          })
        }
      })
    }
  })

  return Array.from(mapUnique.values())
})

const selectedSubService = computed(() => {
  return availableSubServices.value.find((s: any) => s.value === booking.value.subService)
})

// Disparado para carregar os serviços da Barbearia
const selectServiceType = async (serviceType = 'barbearia') => {
  booking.value.service = serviceType
  booking.value.subService = ''
  booking.value.specialist = null
  booking.value.date = ''
  booking.value.time = ''
  currentSlots.value = []

  // Busca os profissionais específicos para o serviço clicado
  await loadSpecialists('', serviceType)

  // Seleciona o primeiro especialista e define o primeiro sub-serviço do banco
  if (filteredSpecialists.value.length > 0) {
    selectSpecialist(filteredSpecialists.value[0])
  }
}

// Disparado quando o cliente seleciona um sub-serviço
const selectSubService = (sub: any) => {
  booking.value.subService = sub.value
  booking.value.time = ''
  if (booking.value.specialist && booking.value.date) {
    loadAvailableHours()
  }
}

// Busca dinâmica de especialistas
const specialistSearch = ref('')
let searchDebounceTimeout: any = null

const onSearchInput = () => {
  if (searchDebounceTimeout) clearTimeout(searchDebounceTimeout)
  searchDebounceTimeout = setTimeout(() => {
    loadSpecialists(specialistSearch.value, booking.value.service)
  }, 300)
}

const clearSpecialistSearch = () => {
  specialistSearch.value = ''
  loadSpecialists('', booking.value.service)
}

// Especialistas carregados da API backend (GET /profissional/disponibilidade)
const apiSpecialists = ref<any[]>([])

// Grade de horários carregada da API backend para o especialista e data selecionados (GET /profissional/:id/horarios)
const currentSlots = ref<any[]>([])
const loadingHours = ref(false)
const hasAvailableSlots = computed(() => currentSlots.value.some((slot: any) => slot.disponivel))

// Agendamentos retornados da API
const activeBookings = ref<any[]>([])
const historyBookings = ref<any[]>([])

// Gerador dinâmico dos próximos 14 dias a partir de hoje
const dynamicCalendarDays = computed(() => {
  const days = []
  const today = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date()
    d.setDate(today.getDate() + i)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const dateStr = `${yyyy}-${mm}-${dd}`
    const weekDay = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase()
    const month = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()
    days.push({
      dateStr,
      dayNum: dd,
      weekDay,
      month
    })
  }
  return days
})

onMounted(async () => {
  const token = useCookie('auth_token').value
  if (!token || token.trim() === '') {
    navigateTo('/login?reason=no-auth')
    return
  }

  const clientId = await getClientId()
  const clientName = await getClientName()
  if (clientName) {
    userId.value = `${clientName} (#${clientId})`
  }

  // Carrega especialistas e agendamentos simultaneamente da API
  await Promise.all([
    loadSpecialists(),
    loadBookings()
  ])

  selectServiceType('barbearia')

  pageLoading.value = false
})

// Converte links do Google Drive (compartilhamento/visualização) em URL direta de imagem
const formatSpecialistImageUrl = (rawUrl?: string | null): string | null => {
  if (!rawUrl || typeof rawUrl !== 'string') return null
  const url = rawUrl.trim()
  if (!url) return null

  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w1000`
    }
  }

  return url
}

// Consulta lista de especialistas com horários e serviços no backend (GET /profissional/disponibilidade)
const loadSpecialists = async (queryTerm = '', serviceType = '') => {
  try {
    const queryParams: any = {}
    if (queryTerm) {
      queryParams.q = queryTerm
    }
    const servicoAlvo = serviceType || booking.value.service
    if (servicoAlvo) {
      queryParams.servico = servicoAlvo
    }
    if (booking.value.date) {
      queryParams.data = booking.value.date
    }

    const response = await useApi<any>('/profissional/disponibilidade', 'GET', { query: queryParams })
    const itens: any[] = response?.data?.itens || response?.itens || []

    const fallbackImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC6hgTFyPs7TzcVm-BDvEPjSCblwAdVPnIJxkpxmM_NY6BoP5EagX5f4zN-h313G7nktoR3p5JQstKwyFT_dF_3vQJyxY8kjVu_zO8gJYk4Db_I98QtN7LeRhW2pYtgpd3TrGuRc79uVxdMprbquPJmCazEOJ6JEat0HbDIOTlwnmXa_Py4oTw1whDsTpO3j8pTwpG7IEBij18wCr_xyxvCt0HfbGvWYxByEr-yUD-2F3FtRc84-pvlA'

    if (itens && itens.length > 0) {
      apiSpecialists.value = itens.map((p: any) => {
        return {
          id: p.id,
          name: p.nome,
          role: 'MESTRE BARBEIRO E ESTILISTA',
          service: 'barbearia',
          image: formatSpecialistImageUrl(p.imagem),
          imageError: false,
          total_disponiveis: p.total_disponiveis,
          slots: p.slots,
          servicos: p.servicos || []
        }
      })
    } else {
      apiSpecialists.value = []
    }
  } catch (error: any) {
    console.error('Erro ao consultar especialistas na API:', error)
  }
}

// Consulta horários do especialista no backend (GET /profissional/:id/horarios)
// Respeitando o horário de 08:00 às 20:00 e a duração do serviço selecionado
const loadAvailableHours = async () => {
  if (!booking.value.specialist || !booking.value.date) {
    currentSlots.value = []
    return
  }

  loadingHours.value = true

  try {
    const currentSub = availableSubServices.value.find((s: any) => s.value === booking.value.subService)
    const duracao = currentSub ? currentSub.duration : 30

    const response = await useApi<any>(`/profissional/${booking.value.specialist.id}/horarios`, 'GET', {
      query: { 
        data: booking.value.date,
        servico: booking.value.subService,
        duracao: duracao
      }
    })

    const slots: any[] = response?.data?.slots || response?.slots || []

    if (slots && slots.length > 0) {
      currentSlots.value = slots

      // Se o horário atualmente selecionado pelo usuário não existir ou estiver ocupado na nova data/serviço, reseta o horário
      if (booking.value.time) {
        const slotSelecionado = slots.find(s => s.hora === booking.value.time)
        if (!slotSelecionado || !slotSelecionado.disponivel) {
          booking.value.time = ''
        }
      }
    } else {
      currentSlots.value = []
      booking.value.time = ''
    }
  } catch (error: any) {
    console.error('Erro ao consultar horários na API:', error)
    currentSlots.value = []
  } finally {
    loadingHours.value = false
  }
}

// Busca agendamentos reais na API (GET /agendamento)
const loadBookings = async () => {
  try {
    const response = await useApi<any>('/agendamento', 'GET', {
      query: { limit: 100 }
    })
    const rawItens: any[] = response?.data?.itens || response?.itens || []

    const mapped = rawItens.map((item: any) => {
      const startDate = new Date(item.data_hora_inicio)
      const formattedDate = !isNaN(startDate.getTime())
        ? startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', timeZone: 'America/Sao_Paulo' }).toUpperCase() + ', ' +
          startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })
        : item.data_hora_inicio

      const serviceFormatted = formatServiceLabel(item.tipo_servico || '')

      return {
        id: item.id,
        rawStatus: item.status,
        status: (item.status || 'PENDENTE').toUpperCase(),
        serviceName: serviceFormatted.toUpperCase(),
        category: 'Barbearia Clássica',
        specialistName: item.profissional?.nome?.toUpperCase() || 'BARBEIRO',
        dateTime: formattedDate,
        price: item.valor_total_estimado,
        dataHoraInicio: item.data_hora_inicio,
        emPromocao: Boolean(item.em_promocao),
        tagPromocao: item.tag_promocao || '',
        servicoObservacao: item.servico_observacao || '',
        observacoes: item.observacoes || ''
      }
    })

    // Separa os agendamentos ativos dos históricos
    const active = mapped.filter((b: any) => b.rawStatus === 'Pendente' || b.rawStatus === 'Confirmado')
    // Ordena agendamentos ativos em ordem cronológica (próximos atendimentos primeiro)
    active.sort((a: any, b: any) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime())
    activeBookings.value = active

    const history = mapped.filter((b: any) => b.rawStatus !== 'Pendente' && b.rawStatus !== 'Confirmado')
    // Histórico em ordem decrescente (mais recentes primeiro)
    history.sort((a: any, b: any) => new Date(b.dataHoraInicio).getTime() - new Date(a.dataHoraInicio).getTime())
    historyBookings.value = history

  } catch (error: any) {
    console.error('Erro ao carregar agendamentos:', error)
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 'meus') {
    loadBookings()
  }
})

const setTab = (tab: string) => {
  activeTab.value = tab
}

// Filtragem de especialistas de acordo com o serviço
const filteredSpecialists = computed(() => {
  if (!booking.value.service) return []
  return apiSpecialists.value.filter(s => s.service === booking.value.service)
})

// Display names formatados
const serviceDisplayName = computed(() => {
  const currentSub = availableSubServices.value.find((s: any) => s.value === booking.value.subService)
  if (currentSub) {
    return currentSub.label
  }
  return 'Barbearia'
})

const dateDisplayName = computed(() => {
  if (booking.value.date && booking.value.time) {
    const parts = booking.value.date.split('-')
    const displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`
    return `${displayDate} às ${booking.value.time}`
  }
  return 'Selecione data & hora'
})

// Total calculado exclusivamente com base nos valores do banco de dados
const totalPrice = computed(() => {
  const currentSub = availableSubServices.value.find((s: any) => s.value === booking.value.subService)
  if (currentSub) {
    return Number(currentSub.price)
  }
  return 0
})

const isBookingComplete = computed(() => {
  const basic = booking.value.service && booking.value.subService && booking.value.specialist && booking.value.date && booking.value.time
  const obsValid = !booking.value.observacoes || booking.value.observacoes.length <= 65535
  return basic && obsValid
})

// Ações do Stepper
const selectSpecialist = (spec: any) => {
  booking.value.specialist = spec
  booking.value.time = ''

  // Garante que haja um sub-serviço válido selecionado para o especialista
  if (spec.servicos && spec.servicos.length > 0) {
    const exists = spec.servicos.some((s: any) => s.tipo_servico === booking.value.subService)
    if (!exists) {
      booking.value.subService = spec.servicos[0].tipo_servico
    }
  }

  if (booking.value.date) {
    loadAvailableHours()
  }
}

const selectDate = async (dateStr: string) => {
  booking.value.date = dateStr
  booking.value.time = ''
  await loadAvailableHours()
}

// Abertura e fechamento do modal de regras antes da confirmação do agendamento
const openRulesModal = () => {
  if (!isBookingComplete.value) return
  rulesAccepted.value = false
  showRulesModal.value = true
}

const closeRulesModal = () => {
  if (confirming.value) return
  showRulesModal.value = false
  rulesAccepted.value = false
}

// Confirmação de Agendamento na API (POST /agendamento)
const confirmBooking = async () => {
  if (!isBookingComplete.value || !rulesAccepted.value) return

  confirming.value = true

  try {
    const clientId = await getClientId()
    if (!clientId) {
      throw new Error('Sessão expirada. Faça login novamente.')
    }

    const currentSub = availableSubServices.value.find((s: any) => s.value === booking.value.subService)
    const duracaoMinutos = currentSub?.duration || 30

    // Calcula data_hora_inicio e data_hora_fim garantindo o fuso horário de São Paulo (-03:00)
    const startDate = new Date(`${booking.value.date}T${booking.value.time}:00-03:00`)
    const endDate = new Date(startDate.getTime() + duracaoMinutos * 60000)

    const formatToSaoPauloIso = (d: Date) => {
      const spStr = d.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' })
      return `${spStr.replace(' ', 'T')}-03:00`
    }

    const startIso = formatToSaoPauloIso(startDate)
    const endIso = formatToSaoPauloIso(endDate)

    const payload = {
      id_cliente: Number(clientId),
      id_profissional: Number(booking.value.specialist.id),
      tipo_servico: booking.value.subService,
      data_hora_inicio: startIso,
      data_hora_fim: endIso,
      status: 'Pendente',
      observacoes: booking.value.observacoes?.trim() || ''
    }

    await useApi<any>('/agendamento', 'POST', {}, payload)

    toast.add({
      severity: 'success',
      summary: 'AGENDAMENTO CONFIRMADO',
      detail: 'Seu horário foi reservado com sucesso.',
      life: 4000
    })

    // Limpa o formulário
    booking.value.service = ''
    booking.value.subService = ''
    booking.value.specialist = null
    booking.value.date = ''
    booking.value.time = ''
    booking.value.observacoes = ''

    // Recarrega a agenda da API e redireciona para a aba de Meus Agendamentos
    await loadBookings()
    setTab('meus')

  } catch (error: any) {
    console.error('Erro ao agendar:', error)
    const errorMsg = error?.data?.error?.message || error?.response?._data?.error?.message || error?.message || 'Erro ao realizar agendamento.'
    
    toast.add({
      severity: 'error',
      summary: 'ERRO NO AGENDAMENTO',
      detail: errorMsg,
      life: 4000
    })

  } finally {
    confirming.value = false
    showRulesModal.value = false
    rulesAccepted.value = false
  }
}

// Cancelamento de Agendamento na API (DELETE /agendamento/:id)
const cancelBooking = (id: number | string) => {
  confirm.require({
    header: 'CANCELAR AGENDAMENTO',
    message: 'Deseja realmente cancelar este agendamento? Esta ação liberará o horário reservado imediatamente.',
    rejectProps: {
      label: 'VOLTAR'
    },
    acceptProps: {
      label: 'SIM, CANCELAR'
    },
    accept: async () => {
      try {
        await useApi<any>(`/agendamento/${id}`, 'DELETE')

        toast.add({
          severity: 'success',
          summary: 'AGENDAMENTO CANCELADO',
          detail: 'O horário foi liberado com sucesso.',
          life: 3000
        })

        await loadBookings()

      } catch (error: any) {
        console.error('Erro ao cancelar agendamento:', error)
        const errorMsg = error?.data?.error?.message || error?.response?._data?.error?.message || error?.message || 'Erro ao cancelar agendamento.'

        toast.add({
          severity: 'error',
          summary: 'ERRO AO CANCELAR',
          detail: errorMsg,
          life: 4000
        })
      }
    }
  })
}

const rebook = () => {
  selectServiceType('barbearia')
  setTab('novo')
}
</script>
