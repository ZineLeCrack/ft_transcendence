"use strict";
const notifIcon = document.querySelector(".notifications");
notifIcon === null || notifIcon === void 0 ? void 0 : notifIcon.addEventListener("click", () => {
    const dot = document.querySelector(".dot");
    if (dot)
        dot.remove(); // Supprime le point rouge à la notification
});
