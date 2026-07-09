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
                          <p class="types">${responseAsJson.types[subindex].type.name}</p>
                          `;
  }
}

async function getName(index) {
  let response = await fetch(BASE_URL + "pokemon/" + index);
  let responseAsJson = await response.json();
  return capitaliseFirstLetter(responseAsJson.forms[0].name);
}

async function createDialog(index) {
  
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
  console.log(responseAsJson.types);
}
