/**
 * Composable global de gerenciamento do tema visual (useTheme)
 * Alterna entre modo claro (clean) e modo escuro (dark) aplicando a classe 'dark' no HTML
 * e persistindo a preferência do usuário no localStorage.
 */
const THEME_STORAGE_KEY = 'theme'

const applyThemeClass = (dark: boolean) => {
  if (import.meta.client) {
    document.documentElement.classList.toggle('dark', dark)
  }
}

export const useTheme = () => {
  const isDark = useState<boolean>('theme_is_dark', () => false)

  /**
   * Inicializa o tema lendo a preferência salva no navegador (padrão: modo claro).
   */
  const initTheme = () => {
    if (!import.meta.client) return

    let savedDark = false
    try {
      savedDark = localStorage.getItem(THEME_STORAGE_KEY) === 'dark'
    } catch {
      savedDark = false
    }

    isDark.value = savedDark
    applyThemeClass(savedDark)
  }

  /**
   * Define explicitamente o tema (true = escuro, false = claro) e salva no localStorage.
   */
  const setTheme = (dark: boolean) => {
    isDark.value = dark
    applyThemeClass(dark)

    if (import.meta.client) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light')
      } catch {
        // Ignora erro caso o navegador bloqueie escrita no localStorage
      }
    }
  }

  /**
   * Alterna entre modo claro e modo escuro.
   */
  const toggleTheme = () => {
    setTheme(!isDark.value)
  }

  return {
    isDark,
    initTheme,
    setTheme,
    toggleTheme
  }
}

