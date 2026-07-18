document.querySelectorAll('[data-gumroad-product]').forEach((button) => {
  button.addEventListener('click', () => {
    const isMini = button.dataset.gumroadProduct === 'winhacks-quick-actions-mini';
    if (typeof window.gtag === 'function') {
      window.gtag('event', isMini ? 'select_free_sample' : 'begin_checkout', {
        currency: 'USD',
        value: isMini ? 0 : 7,
        items: [{item_name:isMini?'WinHacks Quick Actions Mini':'WinHacks Quick Actions - Piloto',price:isMini?0:7,quantity:1}]
      });
    }
  });
});
