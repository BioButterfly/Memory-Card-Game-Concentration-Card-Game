$(document).ready(function() {

    let insertNamePlayer = prompt("Inserisci il tuo nome", ""),
        player = insertNamePlayer.toLowerCase();

    if (player != null) {
        $(".player-name").text(player);
    }

    let classifica = $('.classifica tbody');
    for (let i = 0; i < localStorage.length; i++) {
        classifica.append("<tr id=\"player_"+i+"\" class=\"player\"><td class=\"nome\"></td><td class=\"punteggio\"></td></tr>");
    }

    let j = 0;
    for (let key in localStorage){
        let nome = key;
        classifica.find("#player_"+j+" .nome").text( nome );
        j++;
    }

    for(let i = 0; i < localStorage.length; i++){
        let punteggio = localStorage.getItem(localStorage.key(i));
        classifica.find("#player_"+i+" .punteggio").text( punteggio );
    }

    let scacchiera = 8, // Grandezza della scacchiera
        moves = 0,
        score = 0;

    /* Inserisco i simboli della scacchiera in un array */
    let arrayRaccoltaSimboli = ["fas fa-ghost",
                                "fas fa-ghost",
                                "fab fa-steam",
                                "fab fa-steam",
                                "fab fa-xbox",
                                "fab fa-xbox",
                                "fab fa-playstation",
                                "fab fa-playstation",
                                "fab fa-nintendo-switch",
                                "fab fa-nintendo-switch",
                                "fas fa-gamepad",
                                "fas fa-gamepad",
                                "fab fa-twitch",
                                "fab fa-twitch",
                                "fas fa-headset",
                                "fas fa-headset"
                            ];

    let arraySimboli = [];

    for (let i = 0; i < scacchiera*2; i++) {
        arraySimboli[i] = arrayRaccoltaSimboli[i];
    }
    /* Inserisco i simboli della scacchiera in un array */

    startGame();

    function startGame() {

        /* Inizializzo le variabili del tempo, mosse e punti e le stampo a video */
        let time = 0,
            click1 = null, // Inizializzo a NULL le variabili che tengono traccia della prima e della seconda carta cliccata
            click2 = null; // Inizializzo a NULL le variabili che tengono traccia della prima e della seconda carta cliccata
        /* Inizializzo le variabili del tempo, mosse e punti e le stampo a video */

        $(".time").text(time++);
        $(".moves").text(moves);
        $(".score").text(score);

        shuffle(arraySimboli); // Con la funzione di shuffle mischio i simboli delle carte precedentemente inseriti nell'arraySimboli

        for (let i = 0; i < scacchiera*2; i++) { // con il ciclo for creo la scacchiera con i simboli
            let coppia = $("<div class=\"quadrati col-3 animated\"><div class=\"inner\"><i></i></div></div>");

            coppia.attr("data-simboli", arraySimboli[i].replace(" ", "-")); //Inseriamo l'attributo 'data-simboli' agli elementi per creare un riferimento alle coppie di carte
            coppia.find('i').addClass(arraySimboli[i]); //Inseriamo il simbolo della carta

            $(".scacchiera .row").append(coppia);

            let deg = numeroRandom(0, 360); //Ruota le carte con un angolo random
            coppia.find('.inner').css("transform","rotateZ("+deg+"deg)");

        }

        $("#startGame").click(function() {
            $(this).attr('disabled','disabled');

            /* Logica effetto apparizione delle carte */
            let arrayEffetti = ["fadeIn","fadeInUp", "bounceIn", "bounceInUp", "flipInX", "flipInY", "lightSpeedIn", "rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight", "slideInUp", "slideInDown", "slideInLeft", "slideInRight", "zoomIn", "zoomInUp", "zoomInDown", "zoomInLeft", "zoomInRight", "rollIn", "jackInTheBox"];
            let scacchieraLength = $(".animated").length;
            for (let i = 0; i < scacchieraLength; i++) {
              let delay = numeroRandom(0, 9);
              let effettoRandom = numeroRandom(0, 22);
              $('.animated').eq(i).addClass(arrayEffetti[effettoRandom]).css({"visibility":"visible", "animation-delay":"0."+delay+"s", "animation-duration":"1s"});
            }
            /* Logica effetto apparizione delle carte */

            $(".scacchiera").removeClass('start');

            let moves = 0,
                score = 0,
                intervalTimer = setInterval(function() {
                  $(".time").text(time++);
                }, 1000); // Aumenta il tempo di 1 ogni secondo

            $(".quadrati .inner").click(function(event) {

                let quadrato = $(event.target).parent(); //Recuperiamo l'event.target dell'elemento per rilevare l'elemento cliccato
                let dataSimboli = quadrato.attr("data-simboli"); //Recuperiamo il data-simboli per l'elemento cliccato

                if (!quadrato.hasClass('clicked') && !quadrato.hasClass('ok')) { // Controllo se una carta è già stata cliccata

                    if ($('.clicked').length > 0) { 

                        click2 = dataSimboli;
                        quadrato.addClass("clicked");

                        if (click1 == click2) { // Logica se le carte cliccate risultano uguali

                            click1 = null;
                            click2 = null;

                            $(".quadrati.clicked").addClass("ok"); // aggiungo la classe 'ok' per aggiungere lo sfondo verde alla coppia di carte trovate

                            $(".quadrati.ok").delay(500).queue(function(next) {
                                $(this).removeClass("clicked");
                                next();
                            });

                            $(".moves").text(++moves);
                            $(".score").text(score = score + 3);

                            let numeroCoppieTrovate = $(".quadrati.ok").length; //Ad ogni coppia trovata controllo il numero di coppie trovate.
                            if (numeroCoppieTrovate == scacchiera*2) {

                                let massimo = 3*scacchiera;
                                let minimo = (3*scacchiera) / 2;

                                if (score == massimo) {
                                    $(".stars").html("&#9733;&#9733;&#9733;");
                                } else if (score > minimo && score < massimo ) {
                                     $(".stars").html("&#9733;&#9733;");
                                } else if (score == minimo) {
                                    $(".stars").html("&#9733;");
                                }

                                $('#modalScore').modal('show'); // Gioco completato. Appare la finestra modale con il riepilogo della partita.
                                $("#startGame").removeAttr('disabled','disabled');
                                clearInterval(intervalTimer);

                                localStorage.setItem(player, score);

                                return;
                            }

                        } else { // Logica se le carte cliccate risultano diverse

                            click1 = null;
                            click2 = null;

                            $(".quadrati.clicked").delay(500).queue(function(next) {
                                $(this).removeClass("clicked");
                                next();
                            });

                            $(".moves").text(++moves);
                            if (score > 0) {
                                score = score - 1;
                                $(".score").text(score);
                            }
                        }

                    } else {
                        click1 = dataSimboli;
                        quadrato.addClass("clicked");
                    }

                }

            });

            //Reset Game
            $(".resetGame").click(function(event) {
                $(".quadrati").remove(); // Rimuove tutte le carte della precedente partita
                $(".scacchiera").addClass('start'); //Rimette lo sfondo di "start"
                $("#startGame").removeAttr('disabled','disabled');
                clearInterval(intervalTimer); //Resetta il tempo
                startGame(); //Riavvia il gioco
            });

        });
    }

    function numeroRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffle() {
        let c = null;

        for (j = 0; j < 20; j++) {
            let a = numeroRandom(0, scacchiera*2 - 1);
            let b = numeroRandom(0, scacchiera*2 - 1);
            let c = arraySimboli[a];

            arraySimboli[a] = arraySimboli[b];
            arraySimboli[b] = c;
        }
    }

});