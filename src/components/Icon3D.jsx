// Icônes 3D (Microsoft Fluent Emoji, licence MIT) — servies depuis /public/icons3d,
// incluses dans l'appli et disponibles hors ligne.
export const ICONS_3D = [
  'book', 'hands', 'beads', 'dove', 'candle', 'cross', 'journal', 'sunrise', 'rose', 'fire',
  'seedling', 'herb', 'sunflower', 'tree', 'sparkles', 'heart', 'church', 'bell', 'crown',
  'bulb', 'anchor', 'droplet', 'blood', 'star', 'sun', 'scroll', 'calendar', 'bookmark',
  'chart', 'trophy', 'save', 'mirror', 'writing', 'hourglass',
]

/**
 * @param {string} name   une des clés de ICONS_3D
 * @param {number} size   taille en pixels
 * @param {boolean} muted grisée (ex. onglet inactif, étape non atteinte)
 */
export default function Icon3D({ name, size = 32, muted = false, className = '', alt = '' }) {
  return (
    <img
      src={`/icons3d/${name}.webp`}
      width={size}
      height={size}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      loading="lazy"
      decoding="async"
      draggable="false"
      className={`select-none flex-shrink-0 transition-all duration-300 ${muted ? 'grayscale opacity-40' : ''} ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
