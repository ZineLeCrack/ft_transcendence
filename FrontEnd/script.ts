const notifIcon = document.querySelector(".notifications");
notifIcon?.addEventListener("click", () => {
  const dot = document.querySelector(".dot");
  if (dot) dot.remove(); // Supprime le point rouge à la notification
});
