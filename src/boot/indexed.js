import { boot } from 'quasar/wrappers'
import database from './database'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app, router }) => {
  app.config.globalProperties.$database = database;
})
