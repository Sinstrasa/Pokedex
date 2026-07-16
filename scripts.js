const BASE_URL = "https://pokeapi.co/api/v2/";
const begin = 0;
const end = 20;
let page = 1;
let safe = 0;
let idAkku = [];
let storage = [];

async function initialise() {
  await saveData();
  await placeInMain();
  // search();
}

async function restrainEnd() {
  let responseAsJson = await definePath();
  safe = end + 20 * (page - 1);
  if (safe > responseAsJson.count) {
    safe = responseAsJson.count;
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

async function placeInMain() {
  let responseAsJson = await definePath();
  let contentRef = document.getElementById("pokéCards");
  contentRef.innerHTML = ``;
  await restrainEnd();
  for (let index = begin + 20 * (page - 1); index < safe; index++) {
    let temporaryUrl = await fetch(responseAsJson.results[index].url);
    let tempUrl = await temporaryUrl.json();
    let subindex = storage.findIndex(findId => findId.id === tempUrl.id);
    let name = capitaliseFirstLetter(await getData(subindex, "name"));
    let id = await getData(subindex, "id");
    let sprite = await getData(subindex, "default_sprite");
    let type = await getData(subindex, "type");
    contentRef.innerHTML += pokémonCardtemplate(subindex, sprite, name, id);
    let allTypes = await getMoreTypes(subindex);
    bgColor(subindex, type);
  }
  hideOverlay();
}

async function saveData() {
  let responseAsJson = await definePath();
  await restrainEnd();
  for (let index = begin + 20 * (page - 1); index < safe; index++) {
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
    await storage.push(pokéData);
  }
  // console.log(await storage[0]['abilities']);
  // console.log (capitaliseFirstLetter(await getData(0, "name")));
}

async function getData(index, path) {
  switch (path) {
    case "type":
      return await storage[index]["types"][0].type.name;
      break;
    default:
      return await storage[index][path];
      break;
  }
}

async function getMoreTypes(index) {
  let typesRef = document.getElementById("allTypes" + index);
  typesRef.innerHTML = ``;
  for (
    let subindex = 0;
    subindex < storage[index]["types"].length;
    subindex++
  ) {
    typesRef.innerHTML += `
                          <p class="types">${await capitaliseFirstLetter(storage[index]["types"][subindex].type.name)}</p>
                          `;
  }
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

async function createDialog(index) {
  let dialogRef = document.getElementById("dialogDesign");
  let sprite = await getData(index, "default_sprite");
  let type = await getData(index, "type");
  let name = capitaliseFirstLetter(await getData(index, "name"));
  let id = await getData(index, "id");
  dialogRef.innerHTML = dialogCardTemplate(index, sprite, name, id);
  let allTypes = dialogGetTypes(index);
  dialogbg(index, type);
}

async function showSprite(index, id, path) {
  let spriteRef = document.getElementById("dialogPokémonSprite");
  let sprite = await getData(index, path);
  spriteRef.innerHTML = `
                        <img
                        src="${sprite}"
                        alt="Sprite #${id}">
                        `;
}

async function dialogGetTypes(index) {
  let typesRef = document.getElementById("dialogTypes");
  typesRef.innerHTML = ``;
  for (
    let subindex = 0;
    subindex < storage[index]["types"].length;
    subindex++
  ) {
    typesRef.innerHTML += `
                          <p class="types">${await capitaliseFirstLetter(storage[index]["types"][subindex].type.name)}</p>
                          `;
  }
}

async function dialogGeneral(index) {
  let infoRef = document.getElementById("informationTab");
  infoRef.innerHTML = ``;
  let baseXp = storage[index]["general_attribute"][0];
  let height = storage[index]["general_attribute"][1];
  let weight = storage[index]["general_attribute"][2];
  infoRef.innerHTML = `
                      <p>Base Exp: ${await baseXp}xp</p>
                      <p>Height: ${await height}0cm</p>
                      <p>Weight: ${await weight}0g</p>
                      `;
}

async function dialogStats(index) {
  let infoRef = document.getElementById("informationTab");
  infoRef.innerHTML = ``;
  for (
    let subindex = 0;
    subindex < storage[index]["stats"].length;
    subindex++
  ) {
    infoRef.innerHTML += `<p>
                          ${await capitaliseFirstLetter(await storage[index]["stats"][subindex].stat.name)}:
                          ${await storage[index]["stats"][subindex].base_stat}
                          </p>`;
  }
}

async function dialogAbilities(index) {
  let infoRef = document.getElementById("informationTab");
  infoRef.innerHTML = ``;
  for (
    let subindex = 0;
    subindex < storage[index]["abilities"].length;
    subindex++
  ) {
    infoRef.innerHTML += `
                          <p>${await capitaliseFirstLetter(await storage[index]["abilities"][subindex].ability.name)}</p>
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

async function switchPage(forward) {
  showOverlay();
  if (forward) {
    await page++;
    await saveData();
    if (page > 68) {
      page = 1;
    }
  } else {
    await page--;
    if (page <= 0) {
      page = 68;
    }
    await saveData();
  }
  await showPage();
  await placeInMain();
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
  pageRef.innerHTML = `Page ${page} / 68`;
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
