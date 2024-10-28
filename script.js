// Créer une pastille
function createPastille(event) {
    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const y = event.touches ? event.touches[0].clientY : event.clientY;

    const rhythmInterval = random(240, 900); // Ralentir le rythme
    const size = mapIntervalToSize(rhythmInterval);

    const couleur = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
    const pastille = document.createElement('div');
    pastille.classList.add('pastille', 'pastille-animation'); // Ajout de la classe d'animation
    pastille.style.backgroundColor = couleur;

    pastille.style.left = `${x - size / 2}px`;
    pastille.style.top = `${y - size / 2}px`;
    pastille.style.width = `${size}px`;
    pastille.style.height = `${size}px`;
    container.appendChild(pastille);
    
    // Joue un son
    playBeat(pastille, rhythmInterval);
    pastilleCount++; // Incrémente le compteur de pastilles

    // Pitch d'une tierce descendante toutes les 4 pastilles
    if (pastilleCount % 4 === 0) {
        pitchThirdDown();
    }

    // Faire disparaître la pastille comme de la fumée
    setTimeout(() => {
        pastille.style.transition = 'opacity 0.5s, transform 0.5s'; // Transition pour l'opacité et la transformation
        pastille.style.opacity = '0.8'; // Rendre la pastille transparente
        pastille.style.transform = 'scale(0.5)'; // Réduire la taille
        setTimeout(() => {
            pastille.remove(); // Retirer l'élément du DOM
            pastilleCount--; // Décrémente le compteur de pastilles
        }, 500); // Retirer après la transition
    }, rhythmInterval * 5); // Disparaître après un certain temps

    // Réapparaître après un certain temps
    setTimeout(() => {
        pastille.style.transition = 'opacity 0.5s, transform 0.5s'; // Réinitialiser la transition
        pastille.style.opacity = '1'; // Rendre la pastille visible
        pastille.style.transform = 'scale(1)'; // Remettre à la taille d'origine
        container.appendChild(pastille); // Réajouter la pastille
    }, rhythmInterval * 5 + 1000); // Réapparaître après 1 seconde

    // Ajouter un mouvement aléatoire pour la pastille
    animatePastille(pastille);
}
