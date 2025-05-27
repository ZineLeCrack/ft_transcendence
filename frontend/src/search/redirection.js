var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { usernameh2 } from "./btn.js";
const searchBar = document.getElementById("search-bar");
const IP_NAME = '10.12.200.87';
searchBar === null || searchBar === void 0 ? void 0 : searchBar.addEventListener("keydown", (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (event.key === "Enter") {
        const username = searchBar.value.trim();
        if (!username)
            return;
        try {
            const res = yield fetch(`https://${IP_NAME}:3451/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username }),
            });
            const { exists } = yield res.json();
            if (exists) {
                window.location.href = `src/search/search.html`;
                usernameh2.textContent = username;
            }
            else {
                alert("Utilisateur non trouvé !");
            }
        }
        catch (err) {
            console.error("Erreur lors de la vérification de l'utilisateur :", err);
        }
    }
}));
