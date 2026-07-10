const BASE_URL = "https://pokeapi.co/api/v2/";
const begin = 1;
const end = 21;
let page = 1;
let idAkku = [];

function initialise() {
  addPokémon();
  search();
}

function validateSearch() {
  let contentRef = document.getElementById("pokéCards");
  contentRef.innerHTML = ``;
  let searchRef = document.getElementById("searchInput").value;
  switch (searchRef.length) {
    case 0:
      addPokémon();
      break;
    case (1, 2):
      contentRef.innerHTML = `<p>Not enough characters! Please search with more than 3 characters.</p>`;
      break;
    default:
      searchPoké(searchRef);
      break;
  }
}

async function searchPoké(input) {
  let contentRef = document.getElementById("pokéCards");
  contentRef.innerHTML = ``;
  idAkku = [];
  for (let index = 1; index < 1026; index++) {
    let response = await fetch(BASE_URL + "pokemon/" + index);
    let responseAsJson = await response.json();
    if (
      input.at[0] == responseAsJson.forms[0].name.at[0] &&
      input.at[1] == responseAsJson.forms[0].name.at[1] &&
      input.at[2] == responseAsJson.forms[0].name.at[2]
    ) {
      idAkku.push(index);
    }
  }
  if (idAkku.length == 0) {
    contentRef.innerHTML = `<p>No Pokémon found with these characters.</p>`;
  } else {
    addSearch();
  }
}

async function addSearch() {
  let contentRef = document.getElementById("pokéCards");
  contentRef.innerHTML = ``;
  for (let index = 0; index < idAkku.length; index++) {
    let response = await fetch(BASE_URL + "pokemon/" + idAkku[index]);
    let responseAsJson = await response.json();
    let sprite = await getSprite(index);
    let type = await getType(index);
    let name = await getName(index);
    contentRef.innerHTML += pokémonCardtemplate(index, sprite, name);
    let allTypes = await getMoreTypes(index);
    bgColor(index, type);
  }
}

async function addPokémon() {
  let contentRef = document.getElementById("pokéCards");
  let safe = end + 20 * (page - 1);
  if (safe > 1022) {
    safe = 1026;
  }
  contentRef.innerHTML = ``;
  for (let index = begin + 20 * (page - 1); index < safe; index++) {
    let sprite = await getSprite(index);
    let type = await getType(index);
    let name = await getName(index);
    contentRef.innerHTML += pokémonCardtemplate(index, sprite, name);
    let allTypes = await getMoreTypes(index);
    bgColor(index, type);
  }
}

async function getSprite(index) {
  let response = await fetch(BASE_URL + "pokemon/" + index);
  let responseAsJson = await response.json();
  return responseAsJson.sprites.other.home.front_default;
}

async function getShiny(index) {
  let response = await fetch(BASE_URL + "pokemon/" + index);
  let responseAsJson = await response.json();
  return responseAsJson.sprites.other.home.front_shiny;
}

async function getType(index) {
  let response = await fetch(BASE_URL + "pokemon/" + index);
  let responseAsJson = await response.json();
  return responseAsJson.types[0].type.name;
}

async function getMoreTypes(index) {
  let response = await fetch(BASE_URL + "pokemon/" + index);
  let responseAsJson = await response.json();
  let typesRef = document.getElementById("allTypes" + index);
  typesRef.innerHTML = ``;
  for (let subindex = 0; subindex < responseAsJson.types.length; subindex++) {
    typesRef.innerHTML += `
                          <p class="types">${await capitaliseFirstLetter(responseAsJson.types[subindex].type.name)}</p>
                          `;
  }
}

async function getName(index) {
  let response = await fetch(BASE_URL + "pokemon/" + index);
  let responseAsJson = await response.json();
  return capitaliseFirstLetter(responseAsJson.forms[0].name);
}

async function createDialog(index) {
  let response = await fetch(BASE_URL + "pokemon/" + index);
  let responseAsJson = await response.json();
  let dialogRef = document.getElementById("dialogDesign");
  let sprite = await getSprite(index);
  let name = await getName(index);
  let type = await getType(index);
  dialogRef.innerHTML = dialogCardTemplate(index, sprite, name);
  let allTypes = dialogGetTypes(index);
  dialogbg(index, type);
}

async function defSprite(index) {
  let spriteRef = document.getElementById("dialogPokémonSprite");
  let def = await getSprite(index);
  spriteRef.innerHTML = `
                        <img
                        src="${def}"
                        alt="default #${index}">
                        `;
}

async function shySprite(index) {
  let spriteRef = document.getElementById("dialogPokémonSprite");
  let shy = await getShiny(index);
  spriteRef.innerHTML = `
                        <img
                        src="${shy}"
                        alt="shiny #${index}">
                        `;
}

async function dialogGetTypes(index) {
  let response = await fetch(BASE_URL + "pokemon/" + index);
  let responseAsJson = await response.json();
  let typesRef = document.getElementById("dialogTypes");
  typesRef.innerHTML = ``;
  for (let subindex = 0; subindex < responseAsJson.types.length; subindex++) {
    typesRef.innerHTML += `
                          <p class="types">${await capitaliseFirstLetter(responseAsJson.types[subindex].type.name)}</p>
                          `;
  }
}

async function dialogGeneral(index) {
  let response = await fetch(BASE_URL + "pokemon/" + index);
  let responseAsJson = await response.json();
  let infoRef = document.getElementById("informationTab");
  infoRef.innerHTML = ``;
  let baseXp = responseAsJson.base_experience;
  let height = responseAsJson.height;
  let weight = responseAsJson.weight;
  infoRef.innerHTML = `
                      <p>Base Exp: ${await baseXp}xp</p>
                      <p>Height: ${await height}0cm</p>
                      <p>Weight: ${await weight}0g</p>
                      `;
}

async function dialogStats(index) {
  let response = await fetch(BASE_URL + "pokemon/" + index);
  let responseAsJson = await response.json();
  let infoRef = document.getElementById("informationTab");
  infoRef.innerHTML = ``;
  for (let subindex = 0; subindex < responseAsJson.stats.length; subindex++) {
    infoRef.innerHTML += `
                          <p>${await capitaliseFirstLetter(responseAsJson.stats[subindex].stat.name)}: ${await responseAsJson.stats[subindex].base_stat}</p>
                          `;
  }
}

async function dialogAbilities(index) {
  let response = await fetch(BASE_URL + "pokemon/" + index);
  let responseAsJson = await response.json();
  let infoRef = document.getElementById("informationTab");
  infoRef.innerHTML = ``;
  for (let subindex = 0; subindex < responseAsJson.stats.length; subindex++) {
    infoRef.innerHTML += `
                          <p>${await capitaliseFirstLetter(responseAsJson.abilities[subindex].ability.name)}</p>
                          `;
  }
}

async function switchPokémon(index, forward) {
  let safe = end + 20 * (page - 1);
  if (safe > 1022) {
    safe = 1026;
  }
  if (forward) {
    if (index + 1 == safe) {
      createDialog(begin + 20 * (page - 1));
    } else {
      createDialog(index + 1);
    }
  } else {
    if (index - 1 < begin + 20 * (page - 1)) {
      createDialog(safe - 1);
    } else {
      createDialog(index - 1);
    }
  }
}

function switchPage(forward) {
  if (forward) {
    page++;
    if (page > 52) {
      page = 1;
    }
  } else {
    page--;
    if (page <= 0) {
      page = 52;
    }
  }
  addPokémon();
}

function openDialog(index) {
  let dialogRef = document.getElementById("dialog");
  createDialog(index);
  dialogRef.showModal();
}

function closeDialog() {
  let dialogRef = document.getElementById("dialog");
  dialogRef.close();
}

function stopPropagation(event) {
  event.stopPropagation();
}

async function capitaliseFirstLetter(name) {
  return name[0].toUpperCase() + name.slice(1);
}

function getFocus(id) {
  document.getElementById(id).focus();
}

// Checking for specific elements and its paths
async function search() {
  let response = await fetch(BASE_URL + "pokemon/" + 1);
  let responseAsJson = await response.json();
  console.log(responseAsJson.abilities[0].ability.name);
}
