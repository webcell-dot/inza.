const music = document.getElementById("bgMusic");
const envelope = document.getElementById("envelope");

let currentPage = 1;
let musicStarted = false;


/* =========================
   MUSIC SETTINGS
========================= */

music.loop = true;
music.volume = 0.65;


/* =========================
   ENVELOPE OPEN
========================= */

envelope.addEventListener("click", function () {

    if (envelope.classList.contains("open")) {
        return;
    }

    envelope.classList.add("open");

    // Start music after the user's tap
    if (!musicStarted) {

        music.currentTime = 0;

        music.play()
            .then(function () {
                musicStarted = true;
            })
            .catch(function (error) {
                console.log("Music could not start:", error);
            });
    }

    // Move to Page 2
    setTimeout(function () {
        showPage(2);
    }, 1800);

});


/* =========================
   PAGE TRANSITIONS
========================= */

function showPage(number) {

    const oldPage =
        document.getElementById("page" + currentPage);

    const newPage =
        document.getElementById("page" + number);

    if (!newPage) {
        return;
    }

    oldPage.classList.remove("active");
    newPage.classList.add("active");

    currentPage = number;

    // Scroll to the top of the new page
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    // Reveal the text gradually
    revealText(newPage);


    /*
       MUSIC BEHAVIOUR

       Pages 1, 2, 3
       → Music keeps playing

       Pages 4, 5
       → Music stops
    */

    if (number >= 4) {
        stopMusic();
    } else {
        keepMusicPlaying();
    }

}


/* =========================
   KEEP MUSIC PLAYING
========================= */

function keepMusicPlaying() {

    // If the song has ended, restart it
    if (music.ended) {

        music.currentTime = 0;

        music.play()
            .catch(function (error) {
                console.log("Music restart failed:", error);
            });

        return;
    }

    // If the music was paused unexpectedly,
    // resume it while still on Pages 1–3
    if (music.paused && musicStarted) {

        music.play()
            .catch(function (error) {
                console.log("Music resume failed:", error);
            });

    }

}


/* =========================
   AUTOMATIC MUSIC LOOP
========================= */

music.addEventListener("ended", function () {

    /*
       The song can repeat forever
       while the user is on Pages 1–3.
    */

    if (currentPage <= 3) {

        music.currentTime = 0;

        music.play()
            .catch(function (error) {
                console.log("Music loop failed:", error);
            });

    }

});


/* =========================
   TEXT REVEAL
========================= */

function revealText(page) {

    const texts =
        page.querySelectorAll(".reveal");

    texts.forEach(function (text, index) {

        text.classList.remove("show");

        setTimeout(function () {

            text.classList.add("show");

        }, 400 + index * 650);

    });

}


/* =========================
   STOP MUSIC
========================= */

function stopMusic() {

    if (music.paused) {
        return;
    }

    let volume = music.volume;

    const fade =
        setInterval(function () {

            volume -= 0.05;

            if (volume <= 0) {

                volume = 0;

                clearInterval(fade);

                music.pause();

                music.currentTime = 0;

                // Restore volume for the next visit
                music.volume = 0.65;

                return;
            }

            music.volume = volume;

        }, 100);

}


/* =========================
   WISH / CAKE
========================= */

const wishButton =
    document.getElementById("wishButton");


wishButton.addEventListener("click", function () {

    const cake =
        document.querySelector(".cake");

    const message =
        document.getElementById("finalMessage");

    // Blow out candles
    cake.classList.add("blown");

    // Hide button
    wishButton.style.display = "none";

    // Show final birthday message
    setTimeout(function () {

        message.classList.add("show");

        confetti();

    }, 500);

});


/* =========================
   CONFETTI
========================= */

function confetti() {

    const pieces = 80;

    const colors = [
        "#c5a66a",
        "#c9bbd5",
        "#fffdf8",
        "#e9ddca"
    ];

    for (let i = 0; i < pieces; i++) {

        const piece =
            document.createElement("div");

        piece.style.position = "fixed";

        piece.style.left =
            Math.random() * 100 + "vw";

        piece.style.top = "-10px";

        piece.style.width = "7px";

        piece.style.height = "7px";

        piece.style.background =
            colors[
                Math.floor(
                    Math.random() * colors.length
                )
            ];

        piece.style.zIndex = "9999";

        piece.style.borderRadius = "1px";

        document.body.appendChild(piece);


        const animation =
            piece.animate(

                [
                    {
                        transform:
                            "translateY(0) rotate(0deg)",
                        opacity: 1
                    },

                    {
                        transform:
                            "translateY(110vh) rotate(720deg)",
                        opacity: 0.8
                    }
                ],

                {
                    duration:
                        2000 + Math.random() * 2500,

                    easing: "ease-out"
                }

            );


        animation.onfinish = function () {

            piece.remove();

        };

    }

}