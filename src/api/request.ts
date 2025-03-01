import fetch from './fetch'
export const request = {
  get: (url: string, data: any = {}, options: any = {}) => {
    return fetch({ url, method: 'GET', data, ...options }, options.loading)
  },
  post: (url: string, data: any = {}, options: any = {}) => {
    return fetch({ url, method: 'POST', data, ...options }, options.loading)
  },
  put: (url: string, data: any = {}, options: any = {}) => {
    return fetch({ url, method: 'PUT', data, ...options }, options.loading)
  },
  delete: (url: string, data: any = {}, options: any = {}) => {
    return fetch({ url, method: 'DELETE', data, ...options }, options.loading)
  }
}
