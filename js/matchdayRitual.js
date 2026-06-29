(function () {
    "use strict";

    function getElements() {
        return {
            overlay: document.getElementById("tension-overlay"),
            minute: document.getElementById("tension-minute"),
            type: document.getElementById("tension-type"),
            headline: document.getElementById("tension-headline"),
            narrative: document.getElementById("tension-narrative"),
            continueButton: document.getElementById("btn-continue")
        };
    }

    var typingTimer = null;
    var isOpen = false;

    function clearTyping() {
        if (typingTimer) {
            clearTimeout(typingTimer);
            typingTimer = null;
        }
    }

    function typeWriter(element, text, speed) {
        clearTyping();
        if (!element) return;
        var safeText = String(text || "");
        var index = 0;
        element.textContent = "";
        function typeNext() {
            if (index >= safeText.length) {
                typingTimer = null;
                return;
            }
            element.textContent += safeText.charAt(index);
            index += 1;
            typingTimer = setTimeout(typeNext, speed || 12);
        }
        typeNext();
    }

    function normalizeState(context) {
        var value = String(context || "").toLowerCase();
        if (["vitoria", "virada", "heroi", "euforia", "goleada-favor"].indexOf(value) >= 0) return "state-euphoria";
        if (["derrota", "goleada-contra", "crise", "expulsao", "lesao"].indexOf(value) >= 0) return "state-danger";
        return "state-tension";
    }

    function newspaperName(context) {
        var value = String(context || "").toLowerCase();
        if (value.indexOf("derrota") >= 0 || value.indexOf("crise") >= 0) return "A GAZETA DA ARQUIBANCADA";
        if (value.indexOf("euforia") >= 0 || value.indexOf("vitoria") >= 0) return "THE FOOTBALL CHRONICLE";
        return "JORNAL DO FUTEBOL";
    }

    function buildBriefs(data) {
        var context = String(data && data.context || "").toLowerCase();
        if (context.indexOf("crise") >= 0 || context.indexOf("derrota") >= 0) {
            return ["A diretoria deve cobrar resposta já na próxima semana.", "O vestiário vai precisar de cuidado antes do próximo treino.", "A torcida não esquece quando sente falta de reação."];
        }
        if (context.indexOf("euforia") >= 0 || context.indexOf("vitoria") >= 0) {
            return ["O clube acorda mais leve depois do resultado.", "A próxima partida já parece maior do que ontem.", "O treinador ganhou capital emocional com o grupo."];
        }
        return ["O resultado mexe com a semana do clube.", "A imprensa vai transformar o jogo em narrativa.", "O mundo continua girando antes do próximo apito."];
    }

    function closeRitual() {
        var els = getElements();
        if (!els.overlay) return;
        clearTyping();
        els.overlay.classList.remove("active");
        isOpen = false;
        setTimeout(function () {
            els.overlay.classList.add("hidden");
            els.overlay.classList.remove("state-euphoria", "state-danger", "state-tension", "newspaper-moment");
        }, 260);
        if (window.EventBus) window.EventBus.emit("RITUAL_COMPLETE");
    }

    function triggerClutchMoment(data) {
        var els = getElements();
        if (!els.overlay || !els.headline || !els.narrative || !els.minute || !els.type) return;
        clearTyping();
        els.overlay.classList.remove("state-euphoria", "state-danger", "state-tension", "newspaper-moment");
        els.overlay.classList.add(normalizeState(data && data.context), "newspaper-moment");

        var paper = newspaperName(data && data.context);
        els.minute.textContent = data && data.minute ? "Edição pós-jogo · " + String(data.minute) + "'" : "Edição pós-jogo";
        els.type.textContent = paper;
        els.headline.textContent = data && data.headline ? String(data.headline) : "O JOGO GANHOU MANCHETE";
        els.narrative.textContent = "";

        var card = els.overlay.querySelector(".tension-card");
        if (card) {
            var oldBriefs = card.querySelector(".eg6-paper-briefs");
            if (oldBriefs) oldBriefs.remove();
            var briefs = document.createElement("div");
            briefs.className = "eg6-paper-briefs";
            briefs.innerHTML = buildBriefs(data).map(function (line) { return "<span>" + line + "</span>"; }).join("");
            var actions = card.querySelector(".tension-actions");
            if (actions) card.insertBefore(briefs, actions);
        }

        els.overlay.classList.remove("hidden");
        void els.overlay.offsetWidth;
        els.overlay.classList.add("active");
        isOpen = true;
        typeWriter(els.narrative, data && data.narrative ? data.narrative : "A rodada trouxe uma daquelas histórias que o clube não guarda em tabela.", 10);
    }

    function bind() {
        var els = getElements();
        if (els.continueButton) els.continueButton.addEventListener("click", closeRitual);
        document.addEventListener("keydown", function (event) {
            if (isOpen && (event.key === "Escape" || event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                closeRitual();
            }
        });
        if (window.EventBus) window.EventBus.on("LARGE_EVENT", triggerClutchMoment);
        window.MatchdayRitual = { trigger: triggerClutchMoment, close: closeRitual };
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
    else bind();
}());
