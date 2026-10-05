/* Keep live application routes and backend endpoints in one place. */
window.METHODA_CONFIG = {
  company: { name: 'VittYaan Private Limited', product: 'MethodA', email: 'info@vittyaan.in' },
  app: {
    loginUrl: 'https://app.methoda.in/auth/Login',
    registerUrl: 'https://app.methoda.in/auth/Register',
    appUrl: 'https://app.methoda.in/pages/home',
    plansUrl: 'https://app.methoda.in/pages/Subscription',
    storeUrl: 'https://app.methoda.in/pages/MethodAStore'
  },
  site: { blogDataUrl: '/api/blogs', contactUrl: '/api/contact', defaultBlogImage: 'assets/img/platform-preview.svg' },
  disclosure: {
    short: 'MethodA is a simulated trading platform. No real-money trading is conducted. MethodA is not a SEBI-registered entity.',
    full: 'MethodA provides simulated trading software for practice and self-review. Virtual trading results do not guarantee live-market performance. Premium Account fees may apply. MethodA does not provide personalised investment advice.'
  }
};
