# 📱 Como Rodar o App The Way Customer no Android via USB

Este guia explica como compilar, sincronizar e instalar o **The Way Customer** diretamente em um dispositivo Android físico conectado via cabo USB.

---

## 💡 Entendendo o Fluxo (Analogia do Mundo Real)

> Pense no **Gradle** como a fábrica montadora de carros e no **ADB (Android Debug Bridge)** como o caminhão de transporte.
> 1. O **Nuxt** desenha a lataria e o painel das telas (`.output/public`).
> 2. O **Capacitor** embala tudo dentro do chassi nativo do Android.
> 3. O **Gradle** constrói o motor e gera o pacote instalador (`APK`).
> 4. O **ADB** viaja pelo cabo USB, instala o app no celular e liga o motor automaticamente.

---

## 🛠️ Pré-requisitos no Celular

Antes de conectar ao computador:

1. Acesse **Configurações > Sobre o telefone**.
2. Toque **7 vezes** sobre **"Número da versão"** (ou *Número de compilação*) até aparecer a mensagem *"Você agora é um desenvolvedor"*.
3. Volte em **Configurações > Sistema > Opções do desenvolvedor**.
4. Ative a opção **"Depuração USB"**.
5. Conecte o celular ao computador via cabo USB.
6. Quando surgir uma janela no celular perguntando **"Permitir depuração USB deste computador?"**, marque a caixinha **"Sempre permitir"** e toque em **Permitir**.

---

## 🚀 Como Rodar o Aplicativo

Entre na pasta do projeto no terminal:

```bash
cd "/home/mathgregorin/Área de trabalho/TheWayCollective/TheAwayCollectiveAppCustomer"
```

### Opção 1: Comando Rápido Tudo-em-Um (Recomendado)

```bash
npm run android:deploy
```

> **O que esse comando faz:**
> - `npm run generate`: Gera as telas Nuxt em modo SPA estático.
> - `npx cap sync`: Atualiza os arquivos web dentro da pasta nativa `android/`.
> - `./gradlew assembleDebug`: Compila o APK com os ícones e splash oficiais.
> - `adb install -r`: Envia e instala o APK diretamente no aparelho USB.
> - `adb shell am start`: Abre o app imediatamente na tela do celular.

---

### Opção 2: Somente Gerar o APK

```bash
npm run android:build
```

O arquivo será gerado em:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

### Opção 3: Pelo Capacitor CLI ou Android Studio

```bash
# Pelo Capacitor CLI
npm run cap:run:android

# Abrir no Android Studio
npm run cap:open:android
```

---

## 🔍 Comandos Úteis de Diagnóstico

* **Verificar se o celular está conectado e autorizado:**
  ```bash
  /home/mathgregorin/Android/Sdk/platform-tools/adb devices -l
  ```

* **Acompanhar os logs do aplicativo em tempo real:**
  ```bash
  /home/mathgregorin/Android/Sdk/platform-tools/adb logcat | grep -i "Capacitor"
  ```

* **Desinstalar o app do celular:**
  ```bash
  /home/mathgregorin/Android/Sdk/platform-tools/adb uninstall com.thewaycollective.customer
  ```

