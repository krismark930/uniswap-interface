module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'title': `'Chakra Petch'`,
      'body': `'Archivo'`
    },
    extend: {
      gridTemplateColumns: {
        'menu-item': 'auto minmax(auto, 1fr) auto minmax(0, 72px);',
      },
      spacing: {
        'tooltip': '230px',
      },
      colors: {
        dark: '#0E0E0E',
        white: '#fff',
        'grey-purple': '#8286AB',
        red: '#FD4040',
        blue: '#4355F9',
       purple: '#CE3A8B',
       graydark: '#40444F',
       gray: '#464646',
       'soft-grey': '#A1A1A1',
       'inp-dark': '#242424',
       'inp-light': '#F7F8FF'
      }
    },
    zIndex: {
      'max': '99999'
    },
    boxShadow: {
      'modal-light': '0px 8px 16px rgba(130, 134, 171, 0.12)',
      'modal-dark': '0px 8px 16px rgba(130, 134, 171, 0.32)',
      'tip-light': '0px 2px 6px rgba(130, 134, 171, 0.12)',
      'tip-dark': '0px 2px 6px rgba(130, 134, 171, 0.32)',
    },
    height: {
      '80px': '80px',
      '24px': '24px',
      '56px': '56px',
      '60vh': '60vh'
    }
  },
  variants: {
    extend: {
      fill: ['hover'],
      stroke: ['hover']
    },
  },
  plugins: [],
}
