const BASE_URL = "https://pokeapi.co/api/v2/";
const begin = 1;
const end = 21;
let page = 1;
let safe = 0;
let idAkku = [];
let storage = [];

function initialise() {
  saveData();
  placeInMain();
  // search();
}

async function restrainEnd() {
  safe = end + 20 * (page - 1);
  if (safe > 1022) {
    safe = 1026;
  }
}

async function resetPage() {
  document.getElementById("searchInput").value = "";
  placeInMain();
}

function showOverlay() {
  let overlayRef = document.getElementById("overlay");
  overlayRef.classList.add("overlay_visible");
  toggleButtons(true);
}

function hideOverlay() {
  let overlayRef = document.getElementById("overlay");
  overlayRef.classList.remove("overlay_visible");
  toggleButtons(false);
}

function toggleButtons(isDisabled) {
  document.getElementById("resetButton").disabled = isDisabled;
  document.getElementById("searchButton").disabled = isDisabled;
  document.getElementById("previous").disabled = isDisabled;
  document.getElementById("next").disabled = isDisabled;
}

async function definePath() {
  let response = await fetch(BASE_URL + "pokemon?limit=100000&offset=0");
  return await response.json();
}

function validateSearch() {
  showOverlay();
  let contentRef = document.getElementById("pokéCards");
  contentRef.innerHTML = ``;
  let searchRef = document.getElementById("searchInput").value;
  switch (searchRef.length) {
    case 0:
      placeInMain();
      break;
    case 1:
    case 2:
      contentRef.innerHTML = `<p>Not enough characters! Please search with more than 3 characters.</p>`;
      hideOverlay();
      break;
    default:
      searchPoké(searchRef.toLowerCase());
      break;
  }
}

async function searchPoké(input) {
  let contentRef = document.getElementById("pokéCards");
  idAkku = [];
  for (let index = begin; index < safe; index++) {
    let responseAsJson = await definePath(index);
    let compare = (await responseAsJson.forms[0].name).slice(0, input.length);
    if (input == compare) {
      idAkku.push(index);
    }
  }
  if (idAkku.length == 0) {
    contentRef.innerHTML = `<p data-id="not-found">No Pokémon found with these characters.</p>`;
    hideOverlay();
  } else {
    addSearch();
  }
}

async function addSearch() {
  let contentRef = document.getElementById("pokéCards");
  for (let index = 0; index < idAkku.length; index++) {
    let responseAsJson = await definePath(idAkku[index]);
    let sprite = await getSprite(idAkku[index]);
    let type = await getType(idAkku[index]);
    let name = await getName(idAkku[index]);
    contentRef.innerHTML += pokémonCardtemplate(idAkku[index], sprite, name);
    let allTypes = await getMoreTypes(idAkku[index]);
    bgColor(idAkku[index], type);
  }
  hideOverlay();
}

async function placeInMain() {
  let contentRef = document.getElementById("pokéCards");
  contentRef.innerHTML = ``;
  restrainEnd();
  for (let index = begin + 20 * (page - 1); index < safe; index++) {
    let name = await capitaliseFirstLetter(getData(index, "name"));
    let id = await getData(index, "id");
    let sprite = await getData(index, "default_sprite");
    let type = await getData(index, "types");
    contentRef.innerHTML += pokémonCardtemplate(index, sprite, name, id);
    // let allTypes = await getMoreTypes(index);
    bgColor(index, type);
  }
  hideOverlay();
}

// responseAsJson.results[0].url

async function saveData() {
  let responseAsJson = await definePath();
  restrainEnd();
  for (let index = begin - 1; index < safe - 1; index++) {
    let temporaryUrl = await fetch(responseAsJson.results[index].url);
    let tempUrl = await temporaryUrl.json();
    let pokéData = {};
    Object.assign(pokéData, {
      name: tempUrl.forms[0].name,
      id: tempUrl.id,
      default_sprite: tempUrl.sprites.other.home.front_default,
      shiny_sprite: tempUrl.sprites.other.home.front_shiny,
      types: tempUrl.types,
      abilities: tempUrl.abilities,
      stats: tempUrl.stats,
      general_attribute: [
        tempUrl.base_experience,
        tempUrl.height,
        tempUrl.weight,
      ],
    });
    storage.push(pokéData);
  }
  console.log(storage);
  console.log(capitaliseFirstLetter(getData(0, "name")));
}

function getData(index, path) {
  return storage[index][path];
}

async function getMoreTypes(index) {
  let responseAsJson = await definePath(index);
  let typesRef = document.getElementById("allTypes" + index);
  typesRef.innerHTML = ``;
  for (let subindex = 0; subindex < responseAsJson.types.length; subindex++) {
    typesRef.innerHTML += `
                          <p class="types">${await capitaliseFirstLetter(responseAsJson.types[subindex].type.name)}</p>
                          `;
  }
}

async function createDialog(index) {
  let dialogRef = document.getElementById("dialogDesign");
  let sprite = await getData(index, "default_sprite");
    let type = await getData(index, "types");
    let name = await getData(index, "name");
    let id = await getData(index, "id");
  dialogRef.innerHTML = dialogCardTemplate(index, sprite, name, id);
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
  let responseAsJson = await definePath(index);
  let typesRef = document.getElementById("dialogTypes");
  typesRef.innerHTML = ``;
  for (let subindex = 0; subindex < responseAsJson.types.length; subindex++) {
    typesRef.innerHTML += `
                          <p class="types">${await capitaliseFirstLetter(responseAsJson.types[subindex].type.name)}</p>
                          `;
  }
}

async function dialogGeneral(index) {
  let responseAsJson = await definePath(index);
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
  let responseAsJson = await definePath(index);
  let infoRef = document.getElementById("informationTab");
  infoRef.innerHTML = ``;
  for (let subindex = 0; subindex < responseAsJson.stats.length; subindex++) {
    infoRef.innerHTML += `<p>
                          ${await capitaliseFirstLetter(responseAsJson.stats[subindex].stat.name)}:
                          ${await responseAsJson.stats[subindex].base_stat}
                          </p>`;
  }
}

async function dialogAbilities(index) {
  let responseAsJson = await definePath(index);
  let infoRef = document.getElementById("informationTab");
  infoRef.innerHTML = ``;
  for (
    let subindex = 0;
    subindex < responseAsJson.abilities.length;
    subindex++
  ) {
    infoRef.innerHTML += `
                          <p>${await capitaliseFirstLetter(responseAsJson.abilities[subindex].ability.name)}</p>
                          `;
  }
}

async function switchPokémon(index, forward) {
  restrainEnd();
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
  showOverlay();
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
  showPage();
  placeInMain();
}

function openDialog(index) {
  let dialogRef = document.getElementById("dialog");
  createDialog(index);
  dialogRef.showModal();
  document.body.classList.toggle("dialog_offen");
}

function closeDialog() {
  let dialogRef = document.getElementById("dialog");
  dialogRef.close();
  document.body.classList.toggle("dialog_offen");
}

function stopPropagation(event) {
  event.stopPropagation();
}

function capitaliseFirstLetter(name) {
  return name[0].toUpperCase() + name.slice(1);
}

function getFocus(id) {
  document.getElementById(id).focus();
}

function showPage() {
  let pageRef = document.getElementById("page");
  pageRef.innerHTML = `Page ${page} / 52`;
}

// Checking for specific elements and its paths
async function search() {
  let response = await fetch(BASE_URL + "pokemon?limit=100000&offset=0");
  let responseAsJson = await response.json();
  console.log(await responseAsJson.results[0].url);
}

// .forms[0].name
// .sprites.other.home.front_default
// .sprites.other.home.front_shiny
// .types[0].type.name
// await capitaliseFirstLetter(responseAsJson.types[subindex].type.name)
// pokemon?limit=100000&offset=0
// "pokemon/" + 1
// https://pokeapi.co/api/v2/pokemon/10001/
