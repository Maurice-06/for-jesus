import { Component } from 'react'

/**
 * Filet de sécurité : si un écran plante, on affiche un message au lieu d'une page blanche.
 * Les données ne sont pas touchées.
 */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Erreur dans l’appli :', error, info?.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div role="alert" className="max-w-md mx-auto my-16 p-6 rounded-3xl bg-white/[0.04] border border-white/10 text-center space-y-4">
        <p className="text-4xl" aria-hidden="true">🕊️</p>
        <h1 className="text-xl font-semibold text-slate-50">Un souci est survenu sur cet écran</h1>
        <p className="text-slate-400 leading-relaxed">Vos données sont intactes. Rechargez la page ; si le problème revient, faites une sauvegarde depuis Mon chemin.</p>
        <div className="flex gap-2 justify-center">
          <button onClick={() => window.location.reload()} className="btn-primary min-h-[48px]">Recharger</button>
          <button onClick={() => { this.setState({ error: null }); window.location.assign('/') }} className="btn-secondary min-h-[48px]">Accueil</button>
        </div>
      </div>
    )
  }
}
