export function formatBatchToast({ saved, duplicate, invalid }) {
  if (saved === 0 && duplicate === 0 && invalid > 0) {
    return { message: '❌ Aucun lien TikTok valide', variant: 'error' }
  }
  if (saved === 0 && duplicate > 0 && invalid === 0) {
    return {
      message:
        duplicate === 1
          ? '⚠️ Déjà dans la liste'
          : `⚠️ ${duplicate} déjà dans la liste`,
      variant: 'warning',
    }
  }
  if (saved > 0 && duplicate === 0 && invalid === 0) {
    return {
      message:
        saved === 1 ? '✅ Enregistré !' : `✅ ${saved} liens enregistrés !`,
      variant: 'success',
    }
  }

  const parts = []
  if (saved > 0) parts.push(`${saved} enregistré${saved > 1 ? 's' : ''}`)
  if (duplicate > 0) parts.push(`${duplicate} doublon${duplicate > 1 ? 's' : ''}`)
  if (invalid > 0) parts.push(`${invalid} invalide${invalid > 1 ? 's' : ''}`)

  return {
    message: parts.join(' · '),
    variant: saved > 0 ? 'success' : 'warning',
  }
}
