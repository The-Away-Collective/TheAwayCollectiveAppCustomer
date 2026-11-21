# The Way Collective — App Customer (Mobile)

Aplicativo móvel do Portal do Cliente (Customer) desenvolvido em **Nuxt 4 (SPA)** integrado ao **Capacitor** para Android e iOS.

---

## 📱 Guia Rápido: Como Rodar no Android via USB

Para instruções detalhadas de como rodar no seu celular físico conectado pelo cabo USB, consulte o documento:
👉 **[COMO_RODAR_ANDROID_USB.md](./COMO_RODAR_ANDROID_USB.md)**

### Comandos Rápidos:

```bash
# Gerar somente o APK debug em android/app/build/outputs/apk/debug/app-debug.apk
npm run android:build

# Gerar o APK, instalar no celular via USB e abrir o app
npm run android:deploy
```

---

## 🛠️ Scripts Disponíveis

* `npm run dev` — Inicia o servidor Nuxt local em modo desenvolvimento.
* `npm run generate` — Gera a build estática SPA do Nuxt em `.output/public`.
* `npm run cap:sync` — Sincroniza o build estático com as pastas nativas Android e iOS.
* `npm run android:build` — Gera o build SPA, sincroniza o Capacitor e compila o APK Debug.
* `npm run android:deploy` — Faz o build completo, compila o APK e instala no celular via USB.
* `npm run cap:run:android` — Executa o app no Android via Capacitor CLI.
* `npm run cap:open:android` — Abre o projeto no Android Studio.
* `npm run cap:open:ios` — Abre o projeto no Xcode (macOS).

