function bgColor(index, type, reference) {
  let cardRef;
  if (reference === "card") {
    cardRef = document.getElementById(reference + index);
  } else {
    cardRef = document.getElementById("dialogMain");
  }
  switch (type) {
    case "bug":
      cardRef.classList.add("bg_bug");
      break;
    case "fire":
      cardRef.classList.add("bg_fire");
      break;
    case "normal":
      cardRef.classList.add("bg_normal");
      break;
    case "dark":
      cardRef.classList.add("bg_dark");
      break;
    case "flying":
      cardRef.classList.add("bg_flying");
      break;
    case "poison":
      cardRef.classList.add("bg_poison");
      break;
    case "dragon":
      cardRef.classList.add("bg_dragon");
      break;
    case "ghost":
      cardRef.classList.add("bg_ghost");
      break;
    case "psychic":
      cardRef.classList.add("bg_psychic");
      break;
    case "electric":
      cardRef.classList.add("bg_electric");
      break;
    case "grass":
      cardRef.classList.add("bg_grass");
      break;
    case "rock":
      cardRef.classList.add("bg_rock");
      break;
    case "fairy":
      cardRef.classList.add("bg_fairy");
      break;
    case "ground":
      cardRef.classList.add("bg_ground");
      break;
    case "steel":
      cardRef.classList.add("bg_steel");
      break;
    case "fighting":
      cardRef.classList.add("bg_fighting");
      break;
    case "ice":
      cardRef.classList.add("bg_ice");
      break;
    case "water":
      cardRef.classList.add("bg_water");
      break;
    default:
      break;
  }
}
