import path from 'path'


const rootPath = path.resolve(process.cwd(), '../')
const basePath = path.resolve(__dirname, '../')

const config = {
  propENV: process.env.CONFIG, // from package.json

  paths: {
    root:     (file = '') => path.join(rootPath, file),
    base:     (file = '') => path.join(basePath, file),
    shared:   (file = '') => path.join(basePath, 'shared', file),
    client:   (file = '') => path.join(basePath, 'client', file),
    swapCore: (file = '') => path.join(rootPath, 'swap.core', file),
  },

  publicPath: '/',

  http: {
    host: 'localhost',
    port: process.env.PORT || 9001,
  },

  i18nDate: {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  },

  exchangeRates: {
    'ethbtc': 0.001,
    'btceth': 1000,
    'ethnoxon': 1,
    'noxoneth': 1,
    'btcnoxon': 1000,
    'noxonbtc': 0.001,
  },
}


export default config
