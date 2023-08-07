import { Notify } from 'quasar'

const notify = {
  notify (message: string, color = 'primary', icon = '') {
    Notify.create({
      color,
      message,
      icon,
      timeout: 2500
    })
  },

  negative (message: string) {
    this.notify(message, 'negative')
  },

  positive (message: string) {
    this.notify(message, 'positive')
  }
}

export default notify
