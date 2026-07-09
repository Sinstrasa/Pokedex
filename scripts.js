const BASE_URL = "https://pokeapi.co/api/v2/";

function initialise() {
  addPokémon();
  search();
}

async function addPokémon() {
  let contentRef = document.getElementById("pokéCards");
  contentRef.innerHTML = ``;
  for (let index = 1; index < 21; index++) {
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

// Checking for specific elements and its paths
async function search() {
  let response = await fetch(BASE_URL + "pokemon/" + 1);
  let responseAsJson = await response.json();
  console.log(responseAsJson.sprites.other.home.front_shiny);
}
