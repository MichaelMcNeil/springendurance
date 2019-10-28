setTimeout(() => {
  history.pushState("", document.title, window.location.pathname);
}, 2000);
